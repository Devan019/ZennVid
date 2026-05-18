import { Client } from "@gradio/client";
import { audio_prefix, HF_TOKEN, VOICE_CLONE_REPO, VOICE_CLONE_REPO_API } from "../../env_var";
import fs from "fs/promises";
import { uploadUrlToS3 } from "../../utils/s3";

const voiceClone = async ({
  audio,
  text,
  lang = "en",
}: {
  audio: string;
  text: string;
  lang: string;
}) => {
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

    const url = (result.data as Array<any>)[0].url;

    if (!url) {
      console.log("Voice cloning failed, no URL returned:", result);
      return {
        Key: "",
        Location: "",
      };
    }

    //save to s3
    const finalAudio = await uploadUrlToS3({
      prefix: audio_prefix,
      url,
      contentType: "audio/mpeg",
    })
    return {
      Key: finalAudio?.Key,
      Location: finalAudio?.Location,
    }


  } catch (error: any) {
    console.log("Voice cloning error:", error);
    return {
      Key: "",
      Location: "",
    };
  }
}

// voiceClone("https://res.cloudinary.com/dpnae0bod/raw/upload/v1772008247/zennvid/plmawml8ejvpisow7ufc.mp3", "Hello, this is a voice clone test.", "en").then(result => {
//   console.log("Voice clone result:", result);
// }).catch(err => {
//   console.log("Voice clone error:", err);
// });

export { voiceClone };