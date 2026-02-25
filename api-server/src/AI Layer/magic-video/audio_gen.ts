import { Client } from "@gradio/client";
import { EDGE_TTS_REPO, EDGE_TTS_REPO_API, HF_TOKEN } from "../../env_var";
import { uploadToCloudinary } from "../../utils/cloudinary";

const audioGen = async ({
  text,
  voice,
}: {
  text: string;
  voice: string;
}) => {

  if (!HF_TOKEN || !EDGE_TTS_REPO || !EDGE_TTS_REPO_API) {
    throw new Error("HF_TOKEN, EDGE_TTS_REPO, or EDGE_TTS_REPO_API is not defined in environment variables");
  }

  try {

    const client = await Client.connect(EDGE_TTS_REPO, {
      token: `hf_${HF_TOKEN}`
    });
    //call api
    const result = await client.predict(EDGE_TTS_REPO_API, {
      text: text,
      voice: voice,
      rate: 0,
      pitch: 0,
    });
    console.log("text", text, "voice", voice);
    console.log("Audio generation result:", result.data);
    //upload to cloudinary
    const url = await uploadToCloudinary({
      filePath: (result.data as Array<any>)[0].url,
      resource_type: "raw",
      folder: "zennvid"
    })
    return url;
  } catch (error) {
    console.log("Audio generation error:", error);
    return  null;
  }
};

// function main() {
//   audioGen({
//     text: "Hello, welcome to ZennVid!This is a sample video created with FFmpeg.Enjoy the smooth transitions and captions!",
//     voice: "en-US-MichelleNeural"
//   }).then(url => {
//     console.log("Generated audio URL:", url);
//   }).catch(error => {
//     console.error("Error generating audio:", error);
//   });
// }

// main();

export { audioGen };
