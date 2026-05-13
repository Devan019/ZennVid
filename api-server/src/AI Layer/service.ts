
//get service functions for AI layer here, such as lip sync, video editing, etc.

import { Job } from "bullmq";
import { deleteFromCloudinary } from "../utils/cloudinary";
import { generateTranscript } from "./helpers/transcript";
import { audioGen } from "./magic-video/audio_gen";
import { createVideo } from "./magic-video/ffmpeg";
import { imageGen } from "./magic-video/image_gen";
// import { HFImageGen } from "./magic-video/hf_image";
import { scriptGen } from "./magic-video/script_gen";
import { translateService } from "./magic-video/translate";
import { addSubtitles } from "./sync-studio/add_subtitle";
import { lipSync } from "./sync-studio/lip_sync";
import { voiceClone } from "./sync-studio/voice_clone";


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
      url: "https://res.cloudinary.com/dpnae0bod/video/upload/zennvid/x8ytcshoj7usiw0sakcs.mp4",
      publicId: "zennvid/x8ytcshoj7usiw0sakcs",
      resourceType: "video",
      format: "mp4"
    }

  } catch (error) {
    return null;
  }
}

/* MAGIC VIDEO */
const createMagicVideo = async (
  {
    title,
    style,
    seconds,
    language,
    voice,
    code,
    job,
    userId
  }: {
    title: string;
    style: string;
    seconds: number;
    language: string;
    voice: string;
    code: string;
    job: Job;
    userId: string;
  }
) => {
  try {
    //1. get script
    //max tries
    const MAX_RETRIES = 5;
    let script = null;
    let attempts = 0;
    while (!script && attempts < MAX_RETRIES) {
      script = await scriptGen(title, style, seconds, language);
      attempts++;
      if (!script) {
      } else {
        //sent sse to frontend

        await job.updateProgress({
          stage: "script_generated",
          percent: 10,
          status: "progress",
          userId
        });
        break;
      }
    }
    if (!script) {
      console.log("Script generation failed, exiting.");
      return null;
    }

    //2. generate images 
    const scenes = script.scenes ?? [];
    const prompts = scenes.map((scene: any) => scene.prompt);
    let completedImages = 0;

    const imagePaths = await Promise.all(
      prompts.map(async (prompt: string) => {
        const img = await imageGen(prompt);
        completedImages++;
        return img;
      })
    );
    await job.updateProgress({ stage: "generating_images", percent: 30, status: "progress", userId });


    //3. generate audio
    let audioData = scenes.map((scene: any) => scene.description).join("\n");
    if (language.toLowerCase() !== "english") {
      //translate it
      audioData = await translateService({
        text: audioData,
        dest: language
      });
      //sent sse to frontend

      if (!audioData) {
        console.log("Translation failed, exiting.");
        return null;
      }
      await job.updateProgress({
        stage: "translate_generated",
        percent: 50,
        status: "progress",
        userId
      });
    }

    const audio = await audioGen({
      text: audioData,
      voice
    })

    if (!audio) {
      console.log("Audio generation failed, exiting.");
      return null;
    }
    //sent sse to frontend
    await job.updateProgress({
      stage: "audio_generated",
      percent: 70,
      status: "progress",
      userId
    });

    //4. caption generation
    const captions = await generateTranscript({
      audio: audio?.url,
      language: code
    })

    if (!captions || !captions.segments || captions.segments.length === 0) {
      console.log("Caption generation failed, exiting.");
      return null;
    }

    await job.updateProgress({
      stage: "caption_generated",
      percent: 80,
      status: "progress",
      userId
    });

    //5. video generation
    const finalCaptions = captions.segments.map((segment: any) => ({
      start: segment.start,
      end: segment.end,
      text: segment.text,
      id: segment.id
    }))


    const videoData = await createVideo({
      captionsJson: JSON.stringify(finalCaptions),
      images: imagePaths.map(img => img.url),
      audio: audio.url
    })

    if (!videoData) {
      console.log("Video creation failed, exiting.");
      return null;
    }
    await job.updateProgress({
      stage: "video_stitched",
      percent: 90,
      status: "progress",
      userId
    });
    // 6. delete temp files (images, audio)

    // Delete Images using Promise.all to wait for all deletions
    if (imagePaths.length > 0) {
      try {
        await Promise.all(
          imagePaths.map((imagePath) =>
            deleteFromCloudinary({
              publicId: imagePath.publicId,
              resource_type: "image",
            }).catch(err => console.log(`Failed to delete image ${imagePath.publicId}:`, err))
          )
        );
      } catch (err) {
        console.log("Non-critical error during image cleanup:", err);
      }
    }

    // Delete Audio
    if (audio && audio.publicId) {
      try {
        await deleteFromCloudinary({
          publicId: audio.publicId,
          resource_type: "raw",
        });
      } catch (err) {
        console.log("Non-critical error during audio cleanup:", err);
      }
    }

    //7. return data
    return videoData;

  } catch (error: any) {
    console.log("Error in createMagicVideo:", error);
    await job.updateProgress({
      status: "failed",
      error: error.message || "Unknown error during video generation",
      userId
    });
    throw error;
  }
}




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
}) => {
  try {


    //1. do voice clone
    const voiceCloneResult = await voiceClone(audioPath, text);
    if (!voiceCloneResult) {
      console.log("Voice cloning failed, exiting.");
      return null;
    }
    await job.updateProgress({
      stage: "voice_cloned",
      percent: 20,
      status: "progress",
      userId
    });

    //2. create captions
    const captions = await generateTranscript({
      audio: voiceCloneResult?.url ?? "",
      language: "en"
    })
    if (!captions) {
      console.log("Caption generation failed, exiting.");
      return null;
    }
    await job.updateProgress({
      stage: "caption_generated",
      percent: 40,
      status: "progress",
      userId
    });

    if (!captions || !captions.segments || captions.segments.length === 0) {
      console.log("No captions generated, exiting.");
      return null;
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
      audioPath: voiceCloneResult?.url ?? ""
    });
    // ensure videoData contains a url (lipSync may return an error object)
    if (!videoData || typeof videoData !== "object" || !("url" in videoData)) {
      console.log("Lip sync video creation failed or returned error, exiting.");
      if (videoData && typeof videoData === "object" && "error" in videoData) {
        throw new Error((videoData as any).error);
      }
      return null;
    }
    await job.updateProgress({
      stage: "lip_sync_completed",
      percent: 70,
      status: "progress",
      userId
    });


    //4. add subtitles to video 
    const finalVideo = await addSubtitles({
      videoPath: (videoData && typeof videoData === "object" && "url" in videoData) ? (videoData as any).url : "",
      captions: finalCaptions
    });
    if (!finalVideo) {
      console.log("Adding subtitles failed, exiting.");
      return null;
    }
    await job.updateProgress({
      stage: "subtitles_added",
      percent: 90,
      status: "progress",
      userId
    });

    //5. remove temp data
    try {
      await deleteFromCloudinary({
        publicId: voiceCloneResult?.publicId ?? "",
        resource_type: "raw"
      });
    } catch (err) {
      console.log("Non-critical error during cleanup:", err);
    }

    //6. return final video data
    return finalVideo;

  } catch (error: any) {
    return null;
  }

}




export { createMagicVideo, syncStudioVideo, tmpCreateMagicVideo };