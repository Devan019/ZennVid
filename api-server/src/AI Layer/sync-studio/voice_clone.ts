import { Client } from "@gradio/client";
import { HF_TOKEN, VOICE_CLONE_REPO, VOICE_CLONE_REPO_API } from "../../env_var";
import { uploadToCloudinary } from "../../utils/cloudinary";

const voiceClone = async (audio: string, text: string, lang: string = "en") => {
  try {

    if (!HF_TOKEN || !VOICE_CLONE_REPO_API || !VOICE_CLONE_REPO) {
      throw new Error("HF_TOKEN or VOICE_CLONE_REPO_API is not defined in environment variables");
    }

    const response_0 = await fetch(audio);
    const audioBlob = await response_0.blob();

    const client = await Client.connect(VOICE_CLONE_REPO, {
      token: `hf_${HF_TOKEN}`
    });
    const result = await client.predict(VOICE_CLONE_REPO_API, {
      text: text,
      speaker_wav: audioBlob,
      language: lang,
    });

    const voiceData = await uploadToCloudinary({
      filePath: (result.data as Array<any>)[0].url,
      resource_type: "raw",
      folder: "zennvid"
    })

    return voiceData;
  } catch (error: any) {
    console.log("Voice cloning error:", error);
    return null;
  }
}

// voiceClone("https://res.cloudinary.com/dpnae0bod/raw/upload/v1772008247/zennvid/plmawml8ejvpisow7ufc.mp3", "Hello, this is a voice clone test.", "en").then(result => {
//   console.log("Voice clone result:", result);
// }).catch(err => {
//   console.error("Voice clone error:", err);
// });

export { voiceClone };