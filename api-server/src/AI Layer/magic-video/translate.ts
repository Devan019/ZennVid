import { Client } from "@gradio/client";
import { HF_TOKEN, TRANSLATE_REPO, TRANSLATE_REPO_API } from "../../env_var";

const translateService = async (
  {
    text,
    dest
  }: {
    text: string;
    dest: string;
  }
) => {
  try {

    if (!HF_TOKEN || !TRANSLATE_REPO_API || !TRANSLATE_REPO) {
      throw new Error("HF_TOKEN or TRANSLATE_REPO_API is not defined in environment variables");
    }

    const client = await Client.connect(TRANSLATE_REPO);
    const result = await client.predict(TRANSLATE_REPO_API, {
      text: text,
      lang: dest,
    });

    return result.data;
  } catch (error: any) {
    console.log("Translation error:", error);
    return null;
  }
}

// voiceClone("Hello, how are you?", "gujarati").then(result => {
//   console.log("Translation result:", result);
// }).catch(error => {
//   console.error("Error in translation:", error);
// });

export { translateService };