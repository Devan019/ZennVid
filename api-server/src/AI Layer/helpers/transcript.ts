import { groq } from "./groq_client";

const generateTranscript = async ({audio} : {
  audio: string
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
    });

     return {
      transcript: transcription.text.trim(),
      segments: transcription?.segments || [],
      duration: transcription?.duration,
      language: transcription?.language,
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