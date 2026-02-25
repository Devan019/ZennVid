import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { uploadToCloudinary } from "../../utils/cloudinary";

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
  outputFilename = "output_video.mp4",
}: {
  captionsJson: string;
  images: string[]; 
  audio: string;    
  outputFilename?: string;
}) => {
  try {
    // Parse Captions
    let captions: Caption[];

    try {
      captions = JSON.parse(captionsJson);
      if (!Array.isArray(captions)) {
        throw new Error("Captions JSON must be array");
      }
    } catch (err: any) {
      throw new Error(`Invalid captions JSON: ${err.message}`);
    }

    if (captions.length === 0) {
      throw new Error("Captions array is empty");
    }

    // Create SRT (SAFE TEMP DIR)
    const srtFile = path.join(os.tmpdir(), `temp_${uuidv4()}.srt`);

    const secToSrtTime = (sec: number) => {
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = Math.floor(sec % 60);
      const ms = Math.floor((sec - Math.floor(sec)) * 1000);

      return `${String(h).padStart(2, "0")}:${String(m).padStart(
        2,
        "0"
      )}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
    };

    let srtContent = "";

    captions.forEach((c, i) => {
      srtContent += `${i + 1}\n`;
      srtContent += `${secToSrtTime(c.start)} --> ${secToSrtTime(c.end)}\n`;
      srtContent += `${c.text}\n\n`;
    });
    
    fs.writeFileSync(srtFile, srtContent);

    // Video Settings
    const width = 1280;
    const height = 720;
    const fps = 30;

    // Add tiny padding to avoid last subtitle cut
    const totalDurationSec =
      captions[captions.length - 1].end + 0.2;

    const xfadeDuration = 1;

    const imageDuration =
      (totalDurationSec + xfadeDuration * (images.length - 1)) /
      images.length;

    const imageDurations = new Array(images.length).fill(imageDuration);

    // Build filter_complex
    const filterParts: string[] = [];

    images.forEach((_, i) => {
      const zoomExpr =
        `zoom=1+0.05*sin(2*PI*on/(${fps}*${imageDurations[i]})):` +
        `x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`;

      filterParts.push(
        `[${i}:v]scale=${width}:${height},` +
        `zoompan=${zoomExpr}:fps=${fps}:d=${Math.floor(
          imageDurations[i] * fps
        )}[v${i}]`
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

    filterParts.push(
      `${current}subtitles='${safeSrtPath}':force_style='FontName=Arial,FontSize=22,PrimaryColour=&HFFFFFF&,OutlineColour=&H000000&,Outline=2,Shadow=1,Alignment=2'[v]`
    );

    const filterComplex = filterParts.join(";");

    const outputPath = path.resolve(
      `${uuidv4()}-${outputFilename}`
    );

    // Run FFmpeg
    await new Promise<void>((resolve, reject) => {
      const command = ffmpeg();

      images.forEach((imgUrl, i) => {
        command
          .input(imgUrl)
          .inputOptions(["-loop 1", `-t ${imageDurations[i]}`]);
      });

      command
        .input(audio)
        .complexFilter(filterComplex)
        .outputOptions([
          "-map [v]",
          `-map ${images.length}:a`,
          "-c:v libx264",
          "-preset slow",
          "-crf 23",
          "-r 30",
          "-pix_fmt yuv420p",
          "-c:a aac",
          "-b:a 192k",
          "-shortest",
        ])
        .save(outputPath)
        .on("end", () => resolve())
        .on("error", reject);
    });

    console.log("Video created at:", outputPath);

    
    //upload to Cloudinary 
    const videoData = await uploadToCloudinary({
      filePath: outputPath,
      folder: "zennvid",
      resource_type: "video"
    })
    // Cleanup SRT
    if (fs.existsSync(srtFile)) {
      fs.unlinkSync(srtFile);
    }

    // Cleanup local video file
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    return videoData;

  } catch (error: any) {
    console.log("Video creation error:", error);
    return null;
  }
};

// TEST CALL
// // ---------------------------

// createVideo({
//   captionsJson: JSON.stringify([
//     {
//       id: 0,
//       seek: 0,
//       start: 0,
//       end: 2.38,
//       text: ' Welcome, future super productives.',
//       tokens: [Array],
//       temperature: 0,
//       avg_logprob: -0.16773301,
//       compression_ratio: 1.465587,
//       no_speech_prob: 4.276908e-12
//     },
//     {
//       id: 1,
//       seek: 0,
//       start: 3.3,
//       end: 8.38,
//       text: ' Today we unveil the top 5 productivity tips in one dazzling anime scene.',
//       tokens: [Array],
//       temperature: 0,
//       avg_logprob: -0.16773301,
//       compression_ratio: 1.465587,
//       no_speech_prob: 4.276908e-12
//     },
//     {
//       id: 2,
//       seek: 0,
//       start: 9.38,
//       end: 11.16,
//       text: ' First, crystal clear goals.',
//       tokens: [Array],
//       temperature: 0,
//       avg_logprob: -0.16773301,
//       compression_ratio: 1.465587,
//       no_speech_prob: 4.276908e-12
//     },
//     {
//       id: 3,
//       seek: 0,
//       start: 11.56,
//       end: 16.06,
//       text: ' Write them on the holographic board so they glow brighter than your sunrisi.',
//       tokens: [Array],
//       temperature: 0,
//       avg_logprob: -0.16773301,
//       compression_ratio: 1.465587,
//       no_speech_prob: 4.276908e-12
//     },
//     {
//       id: 4,
//       seek: 0,
//       start: 16.94,
//       end: 21.46,
//       text: ' Second, the Pomodoro clock icon tells you to work 25 minutes.',
//       tokens: [Array],
//       temperature: 0,
//       avg_logprob: -0.16773301,
//       compression_ratio: 1.465587,
//       no_speech_prob: 4.276908e-12
//     },
//     {
//       id: 5,
//       seek: 0,
//       start: 21.94,
//       end: 24.4,
//       text: ' Breathe, repeat, your focus will surge.',
//       tokens: [Array],
//       temperature: 0,
//       avg_logprob: -0.16773301,
//       compression_ratio: 1.465587,
//       no_speech_prob: 4.276908e-12
//     },
//     {
//       id: 6,
//       seek: 0,
//       start: 25.32,
//       end: 28.4,
//       text: ' Third, swipe away the distracting phone symbol.',
//       tokens: [Array],
//       temperature: 0,
//       avg_logprob: -0.16773301,
//       compression_ratio: 1.465587,
//       no_speech_prob: 4.276908e-12
//     },
//     {
//       id: 7,
//       seek: 2840,
//       start: 28.4,
//       end: 35.74,
//       text: ' Silence lets creativity flow. Fourth, power breaks. The coffee cup icon pops to remind you',
//       tokens: [Array],
//       temperature: 0,
//       avg_logprob: -0.062063795,
//       compression_ratio: 1.5657895,
//       no_speech_prob: 1.3563872e-12
//     },
//     {
//       id: 8,
//       seek: 2840,
//       start: 35.74,
//       end: 42.18,
//       text: ' to hydrate and stretch. Fifth, nightly reflection. The book icon flips to show growth.',
//       tokens: [Array],
//       temperature: 0,
//       avg_logprob: -0.062063795,
//       compression_ratio: 1.5657895,
//       no_speech_prob: 1.3563872e-12
//     },
//     {
//       id: 9,
//       seek: 2840,
//       start: 43.16,
//       end: 49.36,
//       text: ' Follow these steps, stay motivated, and let your productivity skyrocket like a neon comet',
//       tokens: [Array],
//       temperature: 0,
//       avg_logprob: -0.062063795,
//       compression_ratio: 1.5657895,
//       no_speech_prob: 1.3563872e-12
//     },
//     {
//       id: 10,
//       seek: 2840,
//       start: 49.36,
//       end: 56,
//       text: ' across the sky. Remember to celebrate small wins and share your progress with friends for',
//       tokens: [Array],
//       temperature: 0,
//       avg_logprob: -0.062063795,
//       compression_ratio: 1.5657895,
//       no_speech_prob: 1.3563872e-12
//     },
//     {
//       id: 11,
//       seek: 5600,
//       start: 56,
//       end: 63.04,
//       text: ' accountability. Your journey will transform your daily routine and unlock hidden potentials.',
//       tokens: [Array],
//       temperature: 0,
//       avg_logprob: -0.08368413,
//       compression_ratio: 1.1219512,
//       no_speech_prob: 8.93274e-12
//     }
//   ]),
//   images: [
//     "https://res.cloudinary.com/dpnae0bod/image/upload/v1771998196/zennvid/titljvxamqovk1xpvd2l.png",
//     "https://res.cloudinary.com/dpnae0bod/image/upload/v1763726631/vibescene/mlsl4a3behze5erl93io.webp",
//     "https://res.cloudinary.com/dpnae0bod/image/upload/v1763726033/vibescene/oxihrzxykqteapl3zwpx.webp",
//   ],
//   audio: "https://res.cloudinary.com/dpnae0bod/raw/upload/v1772029993/zennvid/eqhpspxwnjjuifhigdri.mp3",
// })
//   .then((output) => {
//     console.log("Video created successfully:", output);
//   })
//   .catch((err) => {
//     console.error("Error creating video:", err);
//   });

