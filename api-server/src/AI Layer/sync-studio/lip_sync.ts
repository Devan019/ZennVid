import { Client } from "@gradio/client";
import { 
  HF_TOKEN, 
  HF_TOKEN2, 
  HF_TOKEN3, 
  HF_TOKEN4, 
  HF_TOKEN5, 
  HF_TOKEN6,
  HF_TOKEN7,
  HF_TOKEN8,
  HF_TOKEN9,
  HF_TOKEN10,
  LIP_SYNC_REPO, 
  LIP_SYNC_REPO_API, 
  DURATION 
} from "../../env_var";
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
      throw new Error("Required environment variables are not defined");
    }

    const tokens = [HF_TOKEN, HF_TOKEN2, HF_TOKEN3, HF_TOKEN4, HF_TOKEN5, HF_TOKEN6, HF_TOKEN7, HF_TOKEN8, HF_TOKEN9, HF_TOKEN10].filter(Boolean);

    const [audioResponse, imageResponse] = await Promise.all([
      fetch(audioPath),
      fetch(imagePath)
    ]);
    const audio = await audioResponse.blob();
    const image = await imageResponse.blob();

    let result: any = null;

    for (let i = 0; i < tokens.length; i++) {
      const currentToken = tokens[i];
      try {
        console.log(`Trying lip sync with token ${i + 1}/${tokens.length}...`);

        const client = await Client.connect(LIP_SYNC_REPO, {
          token: `hf_${currentToken}`
        });

        const durationResponse = await client.predict("/get_audio_duration", {
          audio_path: audio,
        });
        const duration = (durationResponse.data as Array<any>)[0]?.value;

        result = await client.predict(LIP_SYNC_REPO_API, {
          image_path: image,
          audio_path: audio,
          prompt: "A person speaking, lips moving in sync with the words, talking head",
          negative_prompt: "low quality, worst quality, deformed, distorted",
          video_duration: duration,
          seed: -1,
        });

        console.log(`Success with token ${i + 1}`);
        break; 

      } catch (err: any) {
        const isQuotaError = 
          err?.title === 'ZeroGPU quota exceeded' || 
          err?.message?.includes('ZeroGPU') || 
          err?.message?.includes('quota');

        if (isQuotaError) {
          console.log(`Token ${i + 1} ZeroGPU quota exceeded.`);
          
          if (i < tokens.length - 1) {
            console.log(`Switching to token ${i + 2}...`);
            continue;
          } else {
            console.log("All HF tokens exhausted their ZeroGPU quota.");
            
            // --- NEW EXTRACTION LOGIC ---
            // Extract "Try again in HH:MM:SS" from the error message using Regex
            const match = err?.message?.match(/(Try again in \d{1,2}:\d{2}:\d{2})/);
            const waitMessage = match ? match[1] : "ZeroGPU quota exceeded for all tokens. Try again later.";
            
            // Throw the extracted message so the outer catch block catches it
            throw new Error(waitMessage);
          }
        } else {
          // It's a different error (e.g., bad image/audio), throw standard error
          throw err;
        }
      }
    }

    if (result && result.data) {
      const videoData = await uploadToCloudinary({
        filePath: (result.data as Array<any>)[0].url,
        resource_type: "raw",
        folder: "zennvid"
      });
      return videoData;
    }

    // If result failed but didn't throw an error
    return { error: "Failed to generate video." };

  } catch (error: any) {
    console.log("Error in lipSync execution:", error.message);
    
    // Return the specific error message instead of null
    return { error: error.message || "An unexpected error occurred during lip sync." }; 
  }
}

// lipSync({
//   imagePath: "https://res.cloudinary.com/dpnae0bod/image/upload/v1772036760/zennvid/sync-studio/bcehd3westadihxvhi8j.png",
//   audioPath: "https://res.cloudinary.com/dpnae0bod/raw/upload/v1772036374/zennvid/g129piaz29ee4qqbnyob.wav"
// }).then((result) => {
//   console.log("Lip Sync Result:", result);
// }).catch((error) => {
//   console.log("Errorin lipSync execution:", error);
// });

export { lipSync };