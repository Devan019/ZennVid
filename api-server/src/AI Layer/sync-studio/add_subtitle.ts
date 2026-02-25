import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import os from "os";
import { uploadToCloudinary } from "../../utils/cloudinary";

interface Caption {
  id: number;
  start: number; // seconds
  end: number;   // seconds
  text: string;
}

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


const createSrt = (captions: Caption[], srtPath: string) => {
  let content = "";

  captions.forEach((c) => {
    content += `${c.id}\n`;
    content += `${secToSrtTime(c.start)} --> ${secToSrtTime(c.end)}\n`;
    content += `${c.text}\n\n`;
  });

  fs.writeFileSync(srtPath, content, "utf-8");
};

export const addSubtitles = async ({
  videoPath,
  captions
}: {
  videoPath: string;
  captions: Caption[];
}) => {
  const srtFile = path.join(os.tmpdir(), `temp_captions_${Date.now()}.srt`);
  const outputPath = path.join(os.tmpdir(), `output_video_${Date.now()}.mp4`);

  try {
    // Create SRT file
    createSrt(captions, srtFile);

    // Windows-safe path
    const safeSrtPath = srtFile
      .replace(/\\/g, "/")
      .replace(/:/g, "\\:");

    await new Promise<void>((resolve, reject) => {
      ffmpeg(videoPath)
        .videoFilters(
          `subtitles='${safeSrtPath}':force_style='FontName=Arial,FontSize=22,PrimaryColour=&HFFFFFF&,OutlineColour=&H000000&,Outline=2,Shadow=1,Alignment=2'`
        )
        .outputOptions(["-c:a copy"])
        .save(outputPath)
        .on("start", (cmd) => console.log("FFmpeg command:\n", cmd))
        .on("stderr", (line) => console.log("FFmpeg:", line))
        .on("end", () => resolve())
        .on("error", reject);
    });

    console.log("Subtitles burned successfully:", outputPath);

    //upload to Cloudinary
    const videoData = await uploadToCloudinary({
      filePath: outputPath,
      folder: "zennvid",
      resource_type: "video"
    })

   

    return videoData;

  } catch (error: any) {
    console.log("Error adding subtitles:", error);
    return null;
  } finally {
    // Cleanup SRT
     //delete srt
    if (fs.existsSync(srtFile)) {
      fs.unlinkSync(srtFile);
    }

    //delete local video file
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  }
};

// addSubtitles({
//   videoPath: "https://res.cloudinary.com/dpnae0bod/raw/upload/v1772036647/zennvid/m4vnl5uhi8hf4lhv5bys.mp4",
//   captions: [{
//       id: 0,
//       start: 0,
//       end: 2.44,
//       text: ' Patience is bitter, but its fruit is sweet.'
//     }
//   ],
// })