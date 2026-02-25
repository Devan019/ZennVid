import { Client } from "@gradio/client";
import { HF_TOKEN, LIP_SYNC_REPO, LIP_SYNC_REPO_API, DURATION } from "../../env_var";
import { uploadToCloudinary } from "../../utils/cloudinary";

const lipSync = async ({
  imagePath,
  audioPath,
}: {
  imagePath: string;
  audioPath: string;
}) => {
  try {

    if (!HF_TOKEN || !LIP_SYNC_REPO_API || !LIP_SYNC_REPO || !DURATION) {
      throw new Error("HF_TOKEN or LIP_SYNC_REPO_API or DURATION is not defined in environment variables");
    }

    const audioResponse = await fetch(audioPath);
    const audio = await audioResponse.blob();

    // Get audio duration
    const client = await Client.connect(LIP_SYNC_REPO, {
      token: `hf_${HF_TOKEN}`
    });
    const durationResponse = await client.predict("/get_audio_duration", {
      audio_path: audio,
    });

    //get duration
    const duration = (durationResponse.data as Array<any>)[0]?.value;

    //fetch image  blobs
    const imageResponse = await fetch(imagePath);
    const image = await imageResponse.blob();

    //get lip sync video
    const result = await client.predict(LIP_SYNC_REPO_API, {
      image_path: image,
      audio_path: audio,
      prompt: "A person speaking, lips moving in sync with the words, talking head",
      negative_prompt: "low quality, worst quality, deformed, distorted",
      video_duration: duration,
      seed: -1,
    });

    //upload result to cloudinary
    const videoData = await uploadToCloudinary({
      filePath: (result.data as Array<any>)[0].url,
      resource_type: "raw",
      folder: "zennvid"
    })

    return videoData;

  } catch (error) {
    console.log("Error in lipSync:", error);
    return null; 
  }
}

// lipSync({
//   imagePath: "https://res.cloudinary.com/dpnae0bod/image/upload/v1772036760/zennvid/sync-studio/bcehd3westadihxvhi8j.png",
//   audioPath: "https://res.cloudinary.com/dpnae0bod/raw/upload/v1772036374/zennvid/g129piaz29ee4qqbnyob.wav"
// }).then((result) => {
//   console.log("Lip Sync Result:", result);
// }).catch((error) => {
//   console.log("Error in lipSync execution:", error);
// });

export { lipSync };