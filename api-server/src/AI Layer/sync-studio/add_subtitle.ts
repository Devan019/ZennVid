import fs from "fs";
import path from "path";
import os from "os";
import ffmpeg from "fluent-ffmpeg";
import { uploadFileToS3 } from "../../utils/s3";
import { video_prefix } from "../../env_var";

interface Caption {
  id: number;
  start: number; // in milliseconds
  end: number;   // in milliseconds
  text: string;
}

/**
 * Converts milliseconds to SRT time format (HH:MM:SS,mmm)
 */
const msToSrtTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const remainingMs = Math.floor(ms % 1000);

  return `${String(h).padStart(2, "0")}:${String(m).padStart(
    2,
    "0"
  )}:${String(s).padStart(2, "0")},${String(remainingMs).padStart(3, "0")}`;
};

const createSrt = (captions: Caption[], srtPath: string) => {
  let content = "";

  captions.forEach((c) => {
    content += `${c.id}\n`;
    content += `${msToSrtTime(c.start)} --> ${msToSrtTime(c.end)}\n`;
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
  const timestamp = Date.now();
  const srtFile = path.join(os.tmpdir(), `temp_captions_${timestamp}.srt`);
  const outputPath = path.join(os.tmpdir(), `output_video_${timestamp}.mp4`);

  try {
    // 1. Create SRT file from millisecond data
    createSrt(captions, srtFile);

    // 2. Windows-safe path escaping for FFmpeg filters
    const safeSrtPath = srtFile
      .replace(/\\/g, "/")
      .replace(/:/g, "\\:");

    // 3. Process Video with FFmpeg
    await new Promise<void>((resolve, reject) => {
      ffmpeg(videoPath)
        .videoFilters(
          `subtitles='${safeSrtPath}':force_style='FontName=Arial,FontSize=22,PrimaryColour=&HFFFFFF&,OutlineColour=&H000000&,Outline=2,Shadow=1,Alignment=2'`
        )
        // Copy audio instead of re-encoding to save time
        .outputOptions(["-c:a copy", "-preset superfast"]) 
        .save(outputPath)
        .on("end", () => resolve())
        .on("error", (err) => {
          console.error("FFmpeg error:", err);
          reject(err);
        });
    });

    // 4. Upload to S3
    const videoData = await uploadFileToS3({
      filePath: outputPath,
      prefix: video_prefix,
      contentType: "video/mp4"
    });

    return videoData;

  } catch (error: any) {
    console.error("Error adding subtitles:", error);
    return null;
  } finally {
    // 5. Cleanup temp files
    if (fs.existsSync(srtFile)) fs.unlinkSync(srtFile);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
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