
//get service functions for AI layer here, such as lip sync, video editing, etc.

import { Job } from "bullmq";
import { generateTranscript } from "./helpers/assembly_trasnscript";
import { audioGen } from "./magic-video/audio_gen";
import { createVideo } from "./magic-video/ffmpeg";
import { imageGen } from "./magic-video/image_gen";
import { scriptGen } from "./magic-video/script_gen";
import { addSubtitles } from "./sync-studio/add_subtitle";
import { lipSync } from "./sync-studio/lip_sync";
import { voiceClone } from "./sync-studio/voice_clone";
import { deleteFileFromS3 } from "../utils/s3";
import fs from "fs/promises";
import path from "path";

export interface VideoData {
  Key: string;
  Location: string;
}


const tmpCreateMagicVideo = async (
  {
    job,
    userId
  }: {
    job: Job;
    userId: string;
  }
) => {
  try {
    //simulate simple progress updates for testing sse flow without calling actual video gen functions, will uncomment above code when ready to test full flow

    //1.wait for 3 sec
    await new Promise(resolve => setTimeout(resolve, 5000));
    await job.updateProgress({
      stage: "script_generated",
      percent: 10,
      status: "progress",
      userId
    });

    //2. wait for 3 sec
    await new Promise(resolve => setTimeout(resolve, 5000));
    await job.updateProgress({
      stage: "generating_images",
      percent: 50,
      status: "progress",
      userId
    });

    //3. wait for 2 sec
    await new Promise(resolve => setTimeout(resolve, 4000));
    await job.updateProgress({
      stage: "audio_generated",
      percent: 70,
      status: "progress",
      userId
    });

    //4. wait for 2 sec
    await new Promise(resolve => setTimeout(resolve, 4000));
    await job.updateProgress({
      stage: "caption_generated",
      percent: 80,
      status: "progress",
      userId
    });


    //wait for 10 sec
    await new Promise(resolve => setTimeout(resolve, 10000));
    //return tmp video data
    return {
      Location: "https://zennvid-ai.s3.ap-south-1.amazonaws.com/videos/41ff974b-dc57-445d-a543-c8a8cd44d30b",
      Key: "videos/41ff974b-dc57-445d-a543-c8a8cd44d30b.mp4",
    }

  } catch (error) {
    return {
      Location: "",
      Key: "",
    }
  }
}

/* MAGIC VIDEO */
const createMagicVideo = async (
  {
    title,
    style,
    voice,
    job,
    userId
  }: {
    title: string;
    style: string;
    voice: string;
    job: Job;
    userId: string;
  }
): Promise<VideoData> => {
  console.time("createMagicVideo");
  try {

    if (!job || !job.id) {
      console.log("Invalid job object, exiting.");
      return {
        Key: "",
        Location: ""
      }
    }

    //create directly to save files
    const cwd = process.cwd();
    const dir = path.join(cwd, "public", "magic-studio", userId, job.id);
    const prefix = "/public/magic-studio/" + userId + "/" + job.id ;
    const final_video_path = "/public/magic-studio/" + userId + "/" + job.id + "/final_video.mp4";
    await fs.mkdir(dir, { recursive: true });

    const WEIGHTS = {
      SCRIPT: 10,
      IMAGES: 40,
      AUDIO: 20,
      CAPTIONS: 10,
      STITCH: 10
    };

    let currentProgress = 0;


    // 1. Get script
    const MAX_RETRIES = 5;
    let script = null;
    let attempts = 0;

    while (!script && attempts < MAX_RETRIES) {
      script = await scriptGen(title, style);
      attempts++;
      if (script) {
        currentProgress += WEIGHTS.SCRIPT;
        // Send SSE to frontend
        await job.updateProgress({
          stage: "script_generated",
          percent: currentProgress,
          status: "progress",
          userId
        });
        break;
      }
    }

    console.log(`Script generation attempts: ${attempts}`);

    if (!script) {
      console.log("Script generation failed, exiting.");
      return {
        Key: "",
        Location: ""
      };
    }


    const scenes = script.scenes ?? [];

    // --- PARALLEL EXECUTION: Images vs. Audio + Captions ---

    // Branch A: Generate Images
    const generateImagesTask = async () => {
      const prompts = scenes.map((scene: any) => scene.prompt);

      const paths = [];

      for (let i = 0; i < prompts.length; i++) {
        try {
          const prompt = prompts[i];

          console.log(`Generating image ${i + 1}/${prompts.length}`);
          const image_path = path.join(dir, `image_${i}.jpg`);
          const imageGenResult = await imageGen({
            prompt,
            filePath: image_path,
            Location: prefix + "/image_" + i + ".jpg"
          });

          console.log(
            `Image generated for prompt ${i + 1}:`,
            imageGenResult
          );

          paths.push(imageGenResult);
        } catch (error) {
          console.log(`Error generating image ${i + 1}:`, error);

          paths.push(null);
        } 
      }

      // update progress after all images are generated
      currentProgress += WEIGHTS.IMAGES;

      console.log(
        "All images generated, updating progress to frontend:",
        currentProgress
      );

      await job.updateProgress({
        stage: "images_generated",
        percent: currentProgress,
        status: "progress",
        userId,
      });

      return paths;
    };

    // Branch B: Generate Audio -> Generate Captions
    const generateAudioAndCaptionsTask = async () => {
      // Generate Audio
      const audioData = scenes.map((scene: any) => scene.description).join("\n");
      const audio_path = path.join(dir, `audio.mp3`);
      const audio = await audioGen({ text: audioData, voice, filePath: audio_path, Location: prefix + "/audio.mp3" });
      console.log("audio is gen")

      if (!audio) {
        throw new Error("Audio generation failed");
      }

      currentProgress += WEIGHTS.AUDIO;
      await job.updateProgress({ stage: "audio_generated", percent: currentProgress, status: "progress", userId });

      // Generate Captions sequentially AFTER Audio
      const audioUrl = cwd + audio.Location;
      const captions = await generateTranscript({ audio: audioUrl });
      console.log("captions are gen")
      if (!captions || !captions.segments || captions.segments.length === 0) {
        throw new Error("Caption generation failed");
      }

      currentProgress += WEIGHTS.CAPTIONS;
      await job.updateProgress({ stage: "caption_generated", percent: currentProgress, status: "progress", userId });

      return { audio, captions };
    };

    // Execute Branch A and Branch B concurrently
    const [imagePaths, audioAndCaptions] = await Promise.all([
      generateImagesTask(),
      generateAudioAndCaptionsTask()
    ]);

    const { audio, captions } = audioAndCaptions;

    // --- END PARALLEL EXECUTION ---

    if (!audio.Location) {
      console.log("Audio generation failed, exiting.");
      return {
        Key: "",
        Location: ""
      };
    }

    // 5. Video generation
    const videoData = await createVideo({
      captionsJson: JSON.stringify(captions.segments),
      images: imagePaths.map((img: any) =>(cwd + img.Location)),
      audio: cwd + audio.Location,
      finalVideoPath: final_video_path
    });

    if (!videoData) {
      console.log("Video creation failed, exiting.");
      return {
        Key: "",
        Location: ""
      };
    }

    currentProgress += WEIGHTS.STITCH;
    await job.updateProgress({
      stage: "video_stitched",
      percent: currentProgress,
      status: "progress",
      userId
    });

    // 6. Delete temp files (images, audio)
    // Delete Images using Promise.all to wait for all deletions
    if (imagePaths.length > 0) {
      try {
        //unlink local files
        await Promise.all(
          imagePaths.map((imagePath: any) =>
            fs.unlink(cwd + imagePath.Location).catch(err => console.log(`Failed to delete local image ${imagePath.Location}:`, err))
          )
        );
      } catch (err) {
        console.log("Non-critical error during image cleanup:", err);
      }
    }

    // Delete Audio
    if (audio && audio.Key) {
      try {
        await fs.unlink(cwd + audio.Location).catch(err => console.log(`Failed to delete local audio ${audio.Location}:`, err));
      } catch (err) {
        console.log("Non-critical error during audio cleanup:", err);
      }
    }
    console.timeEnd("createMagicVideo");
    // 7. Return data
    return {
      Key: (videoData as { Key?: string }).Key ?? "",
      Location: (videoData as { Location?: string }).Location ?? ""
    };

  } catch (error: any) {
    console.log("Error in createMagicVideo:", error);
    await job.updateProgress({
      status: "failed",
      error: error.message || "Unknown error during video generation",
      userId
    });
    console.timeEnd("createMagicVideo");
    throw error;
  }
};



/* SYNC STUDIO VEDIO */
const syncStudioVideo = async ({
  imagePath,
  audioPath,
  text,
  job,
  userId
}: {
  imagePath: string;
  audioPath: string;
  text: string;
  job: any;
  userId: string;
}): Promise<VideoData> => {
  try {
    //1. do voice clone
    const voiceCloneResult = await voiceClone({
      audio: audioPath,
      text,
      lang: "en"
    });
    if (!voiceCloneResult) {
      console.log("Voice cloning failed, exiting.");
      return {
        Key: "",
        Location: ""
      };
    }
    await job.updateProgress({
      stage: "voice_cloned",
      percent: 20,
      status: "progress",
      userId
    });

    //2. create captions
    const captions = await generateTranscript({
      audio: voiceCloneResult?.Location ?? ""
    })
    if (!captions) {
      console.log("Caption generation failed, exiting.");
      return {
        Key: "",
        Location: ""
      };
    }
    await job.updateProgress({
      stage: "caption_generated",
      percent: 40,
      status: "progress",
      userId
    });

    if (!captions || !captions.segments || captions.segments.length === 0) {
      console.log("No captions generated, exiting.");
      return {
        Key: "",
        Location: ""
      };
    }
    const finalCaptions = captions.segments.map((segment: any) => ({
      start: segment.start,
      end: segment.end,
      text: segment.text,
      id: segment.id
    }))

    //3. create lip sync video
    const videoData = await lipSync({
      imagePath,
      audioPath: voiceCloneResult?.Location ?? ""
    });
    // ensure videoData contains a url (lipSync may return an error object)
    if (!videoData || typeof videoData !== "object" ) {
      console.log("Lip sync video creation failed or returned error, exiting.");
      if (videoData && typeof videoData === "object" && "error" in videoData) {
        throw new Error((videoData as any).error);
      }
      return {
        Key: "",
        Location: ""
      };
    }
    await job.updateProgress({
      stage: "lip_sync_completed",
      percent: 70,
      status: "progress",
      userId
    });


    //4. add subtitles to video 
    const finalVideo = await addSubtitles({
      videoPath: (videoData && typeof videoData === "object" && "Location" in videoData) ? (videoData as any).Location : "",
      captions: finalCaptions
    });
    if (!finalVideo) {
      console.log("Adding subtitles failed, exiting.");
      return {
        Key: "",
        Location: ""
      };
    }
    await job.updateProgress({
      stage: "subtitles_added",
      percent: 90,
      status: "progress",
      userId
    });

    //5. remove temp data
    try {
      await deleteFileFromS3(voiceCloneResult?.Key ?? "").catch(err => console.log(`Failed to delete audio ${voiceCloneResult?.Key}:`, err));
    } catch (err) {
      console.log("Non-critical error during cleanup:", err);
    }
    console.timeEnd("sync studio");
    //6. return final video data
    return {
      Key: (finalVideo as { Key?: string }).Key ?? "",
      Location: (finalVideo as { Location?: string }).Location ?? ""
    };

  } catch (error: any) {
    return {
      Key: "",
      Location: ""
    };
  }

}




export { createMagicVideo, syncStudioVideo, tmpCreateMagicVideo };