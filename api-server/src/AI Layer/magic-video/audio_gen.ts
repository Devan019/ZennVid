import { Client } from "@gradio/client";
import { EDGE_TTS_REPO, EDGE_TTS_REPO_API, HF_TOKEN } from "../../env_var";
import fs from "fs/promises";
import path from "path/win32";
const audioGen = async ({
  text,
  voice,
  filePath,
  Location,
}: {
  text: string;
  voice: string;
  filePath: string;
  Location: string;
}) => {

  if (!HF_TOKEN || !EDGE_TTS_REPO || !EDGE_TTS_REPO_API) {
    throw new Error("HF_TOKEN, EDGE_TTS_REPO, or EDGE_TTS_REPO_API is not defined in environment variables");
  }

  try {
    console.time("Audio generation time");
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
    console.log("Audio generation result:", result);

    if (!result || !result.data || !(result.data as Array<any>).length) {
      console.log("Invalid audio generation result:", result);
      return null;
    }

    //get the first audio url from the result
    const audioUrl = (result.data as Array<any>)[0].url;

    if (!audioUrl) {
      console.log("Audio URL not found in the result:", result);
      return {
        Key: "",
        Location: "",
      };
    }
    console.timeEnd("Audio generation time");
    console.time("Audio download time");
    //get audio buffer from the url
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error(`Failed to fetch audio from URL: ${audioUrl}`);
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    console.timeEnd("Audio download time");
    console.time("Audio upload time");
    //save audio to local disk
    await fs.writeFile(filePath, Buffer.from(audioBuffer));
    console.timeEnd("Audio upload time");
    return {
      Key: "LOCAL",
      Location,
    }


  } catch (error) {
    console.log("Audio generation error:", error);
    return null;
  }
};

// const demo = async () => {

//   const dir = path.join(process.cwd(), "public", "magic-studio", "demo_user", "demo_job");
//   await fs.mkdir(dir, { recursive: true });

//   audioGen({
//     text: "A lady sitting on the sofa and reading a book.A lady sitting on the sofa and reading a book.A lady sitting on the sofa and reading a book.A lady sitting on the sofa and reading a book.A lady sitting on the sofa and reading a book.A lady sitting on the sofa and reading a book.A lady sitting on the sofa and reading a book.A lady sitting on the sofa and reading a book.A lady sitting on the sofa and reading a book.A lady sitting on the sofa and reading a book.",
//     filePath: path.join(dir, "test_audio.mp3"),
//     Location: "public/magic-studio/demo_user/demo_job/test_audio.mp3",
//     voice: "en-US-JennyNeural"
//   }).then((res) => {
//     console.log(res);
//   })
//     .catch((err) => {
//       console.log("Error in audio generation:", err);
//     });
// }
// demo();

export { audioGen };
