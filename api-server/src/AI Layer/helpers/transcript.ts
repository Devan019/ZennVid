import { groq } from "./groq_client";

interface Transcript{
  transcript: string,
  segments: {
    id: number,
    start: number,
    end: number,
    text: string
  }[],
  duration: number,
  language: string
}

const generateTranscript = async ({audio, language = "en"} : {
  audio: string,
  language: string
}) => {
  try {
    //fetch audio from url and convert to buffer
    const response = await fetch(audio);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const file = new File([buffer], "audio.mp3");

    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3-turbo",
      temperature: 0,
      response_format: "verbose_json",
      language: language
    });

    const transcript = transcription as unknown as Transcript;

     return {
      transcript: transcript.transcript,
      segments: transcript.segments || [],
      duration: transcript.duration,
      language: transcript.language || language,
    };
  } catch (error) {
    console.log("Error generating transcript:", error);
    return null;
  }
}

// generateTranscript({
//   audio:"https://res.cloudinary.com/dpnae0bod/raw/upload/v1772008247/zennvid/plmawml8ejvpisow7ufc.mp3"
// }).then(transcript => {
//   console.log("Generated transcript:", transcript);
// }).catch(error => {
//   console.error("Error:", error);
// } );

export { generateTranscript };