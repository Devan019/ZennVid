import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { uploadFileToS3 } from "../../utils/s3";
import { video_prefix } from "../../env_var";


dotenv.config();

interface Caption {
  id: number;
  start: number;
  end: number;
  text: string;
}

export const createVideo = async ({
  captionsJson,
  images,
  audio,
  finalVideoPath
}: {
  captionsJson: string;
  images: string[];
  audio: string;
  finalVideoPath: string;
}) => {
  console.time('ffmpegRenderTime')
  try {
    // 1. Parse Captions
    let captions: Caption[];

    try {
      captions = JSON.parse(captionsJson);
      // If it's a nested array (like your example data), flatten it
      if (Array.isArray(captions) && Array.isArray(captions[0])) {
        captions = captions[0];
      }
      if (!Array.isArray(captions)) {
        throw new Error("Captions JSON must be an array");
      }
    } catch (err: any) {
      throw new Error(`Invalid captions JSON: ${err.message}`);
    }

    if (captions.length === 0) {
      throw new Error("Captions array is empty");
    }

    // 2. Create SRT (SAFE TEMP DIR)
    const srtFile = path.join(os.tmpdir(), `temp_${uuidv4()}.srt`);

    // AssemblyAI timestamps are in milliseconds, so we divide by 1000
    const msToSrtTime = (ms: number) => {
      const totalSec = ms / 1000;
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = Math.floor(totalSec % 60);
      const msRem = Math.floor((totalSec - Math.floor(totalSec)) * 1000);

      return `${String(h).padStart(2, "0")}:${String(m).padStart(
        2,
        "0"
      )}:${String(s).padStart(2, "0")},${String(msRem).padStart(3, "0")}`;
    };

    let srtContent = "";

    captions.forEach((c, i) => {
      srtContent += `${i + 1}\n`;
      srtContent += `${msToSrtTime(c.start)} --> ${msToSrtTime(c.end)}\n`;
      srtContent += `${c.text}\n\n`;
    });

    fs.writeFileSync(srtFile, srtContent);

    // 3. Video Settings (Vertical 720x1280)
    const width = 720;
    const height = 1280;
    const fps = 20;

    // FIX: Calculate total duration using ms converted to seconds
    const totalDurationSec = (captions[captions.length - 1].end / 1000) + 0.5; // added 0.5s padding

    const xfadeDuration = 1;
    const imageDuration = (totalDurationSec + xfadeDuration * (images.length - 1)) / images.length;
    const imageDurations = new Array(images.length).fill(imageDuration);

    // 4. Build filter_complex
    const filterParts: string[] = [];

    images.forEach((_, i) => {
      const frames = Math.floor((imageDuration + xfadeDuration) * fps);
      filterParts.push(
        `[${i}:v]scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},` +
        `setsar=1,` + // Ensure square pixels
        `zoompan=z='1.0+0.03*(on/${frames})':d=${frames}:s=${width}x${height}:fps=${fps},` +
        `format=yuv420p[v${i}]`
      );
    });

    let current = "[v0]";

    for (let i = 1; i < images.length; i++) {
      const nextVid = `[v${i}]`;
      const outLabel = `[vx${i}]`;

      const offset = (imageDurations[0] - xfadeDuration) * i;

      filterParts.push(
        `${current}${nextVid}` +
        `xfade=transition=fade:duration=${xfadeDuration}:offset=${offset}${outLabel}`
      );

      current = outLabel;
    }

    // SAFE WINDOWS SUBTITLES
    const safeSrtPath = srtFile
      .replace(/\\/g, "/")   // convert backslashes
      .replace(/:/g, "\\:"); // escape drive colon

    // Increased font size for portrait mode and lifted slightly off the bottom (MarginV)
    filterParts.push(
      `${current}subtitles='${safeSrtPath}':force_style='FontName=Arial,FontSize=28,PrimaryColour=&HFFFFFF&,OutlineColour=&H000000&,Outline=1,Shadow=.5,Alignment=2,MarginV=120'[v]`
    );

    const filterComplex = filterParts.join(";");

    const videoPath = process.cwd() + finalVideoPath;
    const outputDir = path.dirname(videoPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 5. Run FFmpeg
    const videoData = await new Promise<{ Key?: string, Location?: string }>((resolve, reject) => {
      //command
      const command = ffmpeg();

      //  zoompan handles duration and frame generation naturally now
      images.forEach((imgUrl) => {
        command.input(imgUrl);
      });

      //add audio
      command.input(audio);

      //command execution with filter_complex and output to stream
      command
        .complexFilter(filterComplex)
        .outputOptions([
          "-map [v]",
          `-map ${images.length}:a`, // Maps the audio input correctly
          "-c:v libx264",
          "-preset ultrafast",
          "-crf 30",
          `-r ${fps}`,
          "-pix_fmt yuv420p",
          "-c:a aac",
          "-b:a 192k",
          "-shortest",
          "-movflags frag_keyframe+empty_moov+faststart",
        ])
        .format("mp4")
        .on("end", async () => {
          try {
            //add video at s3
            const res = await uploadFileToS3({
              filePath: videoPath,
              prefix: video_prefix,
              contentType: "video/mp4",
            });

            if (!res) {
              reject(new Error("Failed to upload video to S3"));
            }

            resolve({
              Key: res?.Key,
              Location: res?.Location ?? undefined,
            });

          } catch (error) {
            console.log("Upload error:", error);
            reject(error);
          }
        })
        .on("error", reject)
        .save(videoPath);
    });

    // 6. Cleanup temp files
    if (fs.existsSync(srtFile)) fs.unlinkSync(srtFile);
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);

    return {
      Key: videoData?.Key,
      Location: videoData?.Location,
    };

  } catch (error: any) {
    console.log("Video creation error:", error);
    return null;
  }
};

// TEST CALL
// // ---------------------------

// createVideo({
//   captionsJson: JSON.stringify([
//     [
//       {
//         "text": "A",
//         "start": 192,
//         "end": 208,
//         "id": 1
//       },
//       {
//         "text": "lone",
//         "start": 273,
//         "end": 481,
//         "id": 2
//       },
//       {
//         "text": "king",
//         "start": 594,
//         "end": 722,
//         "id": 3
//       },
//       {
//         "text": "gazes",
//         "start": 899,
//         "end": 1285,
//         "id": 4
//       },
//       {
//         "text": "over",
//         "start": 1397,
//         "end": 1606,
//         "id": 5
//       },
//       {
//         "text": "his",
//         "start": 1622,
//         "end": 1686,
//         "id": 6
//       },
//       {
//         "text": "modest",
//         "start": 1799,
//         "end": 2184,
//         "id": 7
//       },
//       {
//         "text": "realm",
//         "start": 2184,
//         "end": 2425,
//         "id": 8
//       },
//       {
//         "text": "at",
//         "start": 2521,
//         "end": 2682,
//         "id": 9
//       },
//       {
//         "text": "dawn,",
//         "start": 2682,
//         "end": 2971,
//         "id": 10
//       },
//       {
//         "text": "his",
//         "start": 3389,
//         "end": 3533,
//         "id": 11
//       },
//       {
//         "text": "destiny",
//         "start": 3566,
//         "end": 4015,
//         "id": 12
//       },
//       {
//         "text": "already",
//         "start": 4192,
//         "end": 4497,
//         "id": 13
//       },
//       {
//         "text": "in",
//         "start": 4610,
//         "end": 4658,
//         "id": 14
//       },
//       {
//         "text": "the",
//         "start": 4690,
//         "end": 4802,
//         "id": 15
//       },
//       {
//         "text": "wind.",
//         "start": 4834,
//         "end": 5188,
//         "id": 16
//       },
//       {
//         "text": "The",
//         "start": 6136,
//         "end": 6216,
//         "id": 17
//       },
//       {
//         "text": "colossal",
//         "start": 6280,
//         "end": 6682,
//         "id": 18
//       },
//       {
//         "text": "forces",
//         "start": 6698,
//         "end": 7148,
//         "id": 19
//       },
//       {
//         "text": "of",
//         "start": 7180,
//         "end": 7276,
//         "id": 20
//       },
//       {
//         "text": "the",
//         "start": 7276,
//         "end": 7405,
//         "id": 21
//       },
//       {
//         "text": "Giant",
//         "start": 7405,
//         "end": 7790,
//         "id": 22
//       },
//       {
//         "text": "Empire",
//         "start": 7886,
//         "end": 8240,
//         "id": 23
//       },
//       {
//         "text": "march,",
//         "start": 8240,
//         "end": 8593,
//         "id": 24
//       },
//       {
//         "text": "their",
//         "start": 9252,
//         "end": 9348,
//         "id": 25
//       },
//       {
//         "text": "shadows",
//         "start": 9348,
//         "end": 9798,
//         "id": 26
//       },
//       {
//         "text": "swallowing",
//         "start": 9846,
//         "end": 10280,
//         "id": 27
//       },
//       {
//         "text": "the",
//         "start": 10312,
//         "end": 10408,
//         "id": 28
//       },
//       {
//         "text": "valley.",
//         "start": 10408,
//         "end": 10714,
//         "id": 29
//       },
//       {
//         "text": "He",
//         "start": 11742,
//         "end": 11854,
//         "id": 30
//       },
//       {
//         "text": "mounts",
//         "start": 11854,
//         "end": 12304,
//         "id": 31
//       },
//       {
//         "text": "his",
//         "start": 12304,
//         "end": 12368,
//         "id": 32
//       },
//       {
//         "text": "swift",
//         "start": 12400,
//         "end": 12802,
//         "id": 33
//       },
//       {
//         "text": "hawk,",
//         "start": 12802,
//         "end": 13187,
//         "id": 34
//       },
//       {
//         "text": "a",
//         "start": 13685,
//         "end": 13701,
//         "id": 35
//       },
//       {
//         "text": "daring",
//         "start": 13766,
//         "end": 14055,
//         "id": 36
//       },
//       {
//         "text": "plan",
//         "start": 14167,
//         "end": 14456,
//         "id": 37
//       },
//       {
//         "text": "taking",
//         "start": 14569,
//         "end": 14938,
//         "id": 38
//       },
//       {
//         "text": "flight",
//         "start": 14970,
//         "end": 15388,
//         "id": 39
//       },
//       {
//         "text": "against",
//         "start": 15388,
//         "end": 15773,
//         "id": 40
//       },
//       {
//         "text": "the",
//         "start": 15773,
//         "end": 15870,
//         "id": 41
//       },
//       {
//         "text": "storm.",
//         "start": 15870,
//         "end": 16255,
//         "id": 42
//       },
//       {
//         "text": "With",
//         "start": 17219,
//         "end": 17396,
//         "id": 43
//       },
//       {
//         "text": "a",
//         "start": 17396,
//         "end": 17412,
//         "id": 44
//       },
//       {
//         "text": "thunderous",
//         "start": 17460,
//         "end": 17862,
//         "id": 45
//       },
//       {
//         "text": "strike,",
//         "start": 17862,
//         "end": 18247,
//         "id": 46
//       },
//       {
//         "text": "the",
//         "start": 18745,
//         "end": 18825,
//         "id": 47
//       },
//       {
//         "text": "hawk",
//         "start": 18825,
//         "end": 19147,
//         "id": 48
//       },
//       {
//         "text": "brings",
//         "start": 19147,
//         "end": 19436,
//         "id": 49
//       },
//       {
//         "text": "the",
//         "start": 19468,
//         "end": 19613,
//         "id": 50
//       },
//       {
//         "text": "empire's",
//         "start": 19629,
//         "end": 20207,
//         "id": 51
//       },
//       {
//         "text": "war",
//         "start": 20271,
//         "end": 20432,
//         "id": 52
//       },
//       {
//         "text": "machine",
//         "start": 20432,
//         "end": 20801,
//         "id": 53
//       },
//       {
//         "text": "to",
//         "start": 20898,
//         "end": 21042,
//         "id": 54
//       },
//       {
//         "text": "its",
//         "start": 21058,
//         "end": 21219,
//         "id": 55
//       },
//       {
//         "text": "knees.",
//         "start": 21219,
//         "end": 21444,
//         "id": 56
//       },
//       {
//         "text": "Victory",
//         "start": 22584,
//         "end": 22970,
//         "id": 57
//       },
//       {
//         "text": "blooms",
//         "start": 23002,
//         "end": 23419,
//         "id": 58
//       },
//       {
//         "text": "as",
//         "start": 23548,
//         "end": 23612,
//         "id": 59
//       },
//       {
//         "text": "the",
//         "start": 23644,
//         "end": 23693,
//         "id": 60
//       },
//       {
//         "text": "kingdom's",
//         "start": 23725,
//         "end": 24223,
//         "id": 61
//       },
//       {
//         "text": "flag",
//         "start": 24271,
//         "end": 24608,
//         "id": 62
//       },
//       {
//         "text": "rises,",
//         "start": 24608,
//         "end": 25058,
//         "id": 63
//       },
//       {
//         "text": "the",
//         "start": 25572,
//         "end": 25652,
//         "id": 64
//       },
//       {
//         "text": "king's",
//         "start": 25717,
//         "end": 25941,
//         "id": 65
//       },
//       {
//         "text": "courage",
//         "start": 26054,
//         "end": 26439,
//         "id": 66
//       },
//       {
//         "text": "forever",
//         "start": 26439,
//         "end": 26841,
//         "id": 67
//       },
//       {
//         "text": "etched",
//         "start": 26921,
//         "end": 27178,
//         "id": 68
//       },
//       {
//         "text": "in",
//         "start": 27178,
//         "end": 27275,
//         "id": 69
//       },
//       {
//         "text": "history.",
//         "start": 27323,
//         "end": 27708,
//         "id": 70
//       }
//     ]
//   ]),
//   images: [
//     "https://res.cloudinary.com/dpnae0bod/image/upload/v1778666638/zennvid/hh6btnfi8wqa8fjrajsh.png",
//     "https://res.cloudinary.com/dpnae0bod/image/upload/v1778666641/zennvid/pfjl456xxsojcethoab1.png",
//     "https://res.cloudinary.com/dpnae0bod/image/upload/v1778666642/zennvid/uo9rxdvojuxpccga9ryj.png",
//     "https://res.cloudinary.com/dpnae0bod/image/upload/v1778666642/zennvid/qio4zs8pk92x921mwewd.png",
//     "https://res.cloudinary.com/dpnae0bod/image/upload/v1778666649/zennvid/y9sn5ywtydkqlxlxhmou.png",
//   ],
//   audio: "https://res.cloudinary.com/dpnae0bod/raw/upload/v1778666616/zennvid/nimfp9yg0qudiokabmz8.mp3",
// })
//   .then((output) => {
//     console.log("Video created successfully:", output);
//   })
//   .catch((err) => {
//     console.log("Error creating video:", err);
//   });

