
//get service functions for AI layer here, such as lip sync, video editing, etc.

import { deleteFromCloudinary } from "../utils/cloudinary";
import { generateTranscript } from "./helpers/transcript";
import { audioGen } from "./magic-video/audio_gen";
import { createVideo } from "./magic-video/ffmpeg";
import { imageGen } from "./magic-video/image_gen";
import { scriptGen } from "./magic-video/script_gen";
import { translateService } from "./magic-video/translate";
import { addSubtitles } from "./sync-studio/add_subtitle";
import { lipSync } from "./sync-studio/lip_sync";
import { voiceClone } from "./sync-studio/voice_clone";


/* MAGIC VIDEO */
const createMagicVideo = async (
  {
    title,
    style,
    seconds,
    language,
    voice
  }: {
    title: string;
    style: string;
    seconds: number;
    language: string;
    voice: string;
  }
) => {
  try {
    console.log("Let's go with magic video creation!");
    //1. get script
    //max tries
    const MAX_RETRIES = 14;
    let script = null;
    let attempts = 0;
    while (!script && attempts < MAX_RETRIES) {
      script = await scriptGen(title, style, seconds, language);
      attempts++;
      if(!script){
        console.log("Script generation failed, retrying attempt", attempts);
      }else{
        console.log("\n\n\n\n\nStage 1: cleared",script);
        break;
      }
    }
    if(!script){
      console.log("Script generation failed, exiting.");
      return null;
    }

    //2. generate images 
    const scenes = script.scenes ?? [];
    const prompts = scenes.map((scene: any) => scene.prompt);
    const imagePaths = await Promise.all(prompts.map(async (prompt: string) => await imageGen(prompt)));
    console.log("\n\n\n\n\nStage 2: cleared",imagePaths);

    //3. generate audio
    let audioData = scenes.map((scene: any) => scene.description).join("\n");
    if (language.toLowerCase() !== "english") {
      //translate it
      audioData = await translateService({
        text: audioData,
        dest: language
      });
      console.log("\n\n\n\n\nStage 2.5: cleared",audioData);
      if(!audioData){
        console.log("Translation failed, exiting.");
        return null;
      }
    }
    console.log("\n\n\n\n\nStage 3 prep: cleared",audioData);

    const audio = await audioGen({
      text: audioData,
      voice
    })

    console.log("\n\n\n\n\nStage 3: cleared",audio);
    if(!audio){
      console.log("Audio generation failed, exiting.");
      return null;
    }

    //4. caption generation
    const captions = await generateTranscript({
      audio: audio?.url,
      language: "en"
    })

    console.log("\n\n\n\n\nStage 4: cleared",captions);
    if(!captions || !captions.segments || captions.segments.length === 0){
      console.log("Caption generation failed, exiting.");
      return null;
    }
    //5. video generation

    const finalCaptions = captions.segments.map((segment: any) => ({
      start: segment.start,
      end: segment.end,
      text: segment.text,
      id: segment.id
    }))

    
    const videoData = await createVideo({
      captionsJson: JSON.stringify(finalCaptions),
      images:  imagePaths.map(img => img.url),
      audio: audio.url
    })

    console.log("\n\n\n\n\nStage 5: cleared",videoData);
    if(!videoData){
      console.log("Video creation failed, exiting.");
      return null;
    }
    //6. delete temp files (images, audio)

    //images delete
    imagePaths.forEach(async (imagePath) => {
      await deleteFromCloudinary({
        publicId: imagePath.publicId,
        resource_type: "image"
      });
    });
    console.log("\n\n\n\n\nStage 6: cleared - images deleted");

    //audio delete
    await deleteFromCloudinary({
      publicId: audio.publicId,
      resource_type: "raw"
    })

    console.log("\n\n\n\n\nStage 6: cleared - audio deleted");

    //7. return data
    return videoData;

  } catch (error) {
    console.log("Error in createMagicVideo:", error);
    return null;
  }
}




/* SYNC STUDIO VEDIO */
const syncStudioVideo = async ({
  imagePath,
  audioPath,
  text
}: {
  imagePath: string;
  audioPath: string;
  text: string;
}) => {
  try {

    console.log("Let's go with sync studio video creation!");

    //1. do voice clone
    const voiceCloneResult = await voiceClone(audioPath, text);
    if(!voiceCloneResult){
      console.log("Voice cloning failed, exiting.");
      return null;
    }
    console.log("\n\n\n\n\nStage 1: cleared",voiceCloneResult);

    //2. create captions
    const captions = await generateTranscript({
      audio: voiceCloneResult?.url ?? "",
      language : "en"
    })
    if(!captions){
      console.log("Caption generation failed, exiting.");
      return null;
    }
    console.log("\n\n\n\n\nStage 2: cleared",captions);

    if(!captions || !captions.segments || captions.segments.length === 0) {
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
    if(!videoData){
      console.log("Lip sync video creation failed, exiting.");
      return null;
    }
    console.log("\n\n\n\n\nStage 3: cleared",videoData);
  
    //4. add subtitles to video 
    const finalVideo = await addSubtitles({
      videoPath: videoData?.url ?? "",
      captions: finalCaptions 
    });
    if(!finalVideo){
      console.log("Adding subtitles failed, exiting.");
      return null;
    }
    console.log("\n\n\n\n\nStage 4: cleared",finalVideo);

    //5. remove temp data
    //remove audio
    deleteFromCloudinary({
      publicId: voiceCloneResult?.publicId ?? "",
      resource_type: "raw"
    })

    //6. return final video data
    return finalVideo;

    // return null
  } catch (error) {
    console.log("Error in createMagicVideo:", error);
    return null;
  }
}

// syncStudioVideo({
//     imagePath: "https://res.cloudinary.com/dpnae0bod/image/upload/v1772036760/zennvid/sync-studio/bcehd3westadihxvhi8j.png",
//     audioPath: "https://res.cloudinary.com/dpnae0bod/raw/upload/v1772036374/zennvid/g129piaz29ee4qqbnyob.wav",
//     text: "Patience is bitter, but its fruit is sweet."
// })


export { createMagicVideo, syncStudioVideo };