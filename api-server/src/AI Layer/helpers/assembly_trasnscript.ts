import { AssemblyAI } from "assemblyai";
import { ASSEMBLY_AI_KEY } from "../../env_var";

const baseUrl = "https://api.assemblyai.com";

const client = new AssemblyAI({
  apiKey: ASSEMBLY_AI_KEY ?? "",
  baseUrl: baseUrl,
});


const generateTranscript = async ({ audio }: {
  audio: string
}) => {
  try {
    const transcript = await client.transcripts.transcribe({
      audio,
      speech_models: ["universal-3-pro"]
    });

    //if error
    if (transcript.status === "error") {
      console.log("Error generating transcript:", transcript.error);
      return null;
    }

    const data:any = {
      transcript: transcript.text,
      duration: transcript.audio_duration,
      segments: []
    }

    //add manully id to data for later use
    transcript.words?.map((word: any, index: number) => data["segments"].push({
      start: word.start,
      end: word.end,
      text: word.text,
      id: index + 1
    }));

    return data;
  } catch (error) {
    console.error("Error generating transcript:", error);
    return null;
  }
}

// generateTranscript({
//   audio: process.cwd() + "/public/magic-studio/demo_user/demo_job/test_audio.mp3"
// })
// .then((res) => {
//   console.log("Transcript generation result:", res);
// })
// .catch((err) => {  console.log("Error in transcript generation:", err);
// });

export {
  generateTranscript
}