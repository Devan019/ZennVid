import ApiDocumentation from "@/components/openapi/ApiDocs";
import { GEN_AUDIO, VOICES } from "@/constants/backend_routes";

const endpoints = [
  {
    method: 'POST',
    endpoint: GEN_AUDIO,
    description: 'Convert text to natural-sounding speech audio',
    credits: 10,
    sampleRequest: {
      text: 'Welcome to ZennVid, the future of AI-powered content creation.',
      voice: 'en-CA-ClaraNeural',
    },
    sampleResponse: {
      "MESSAGE": "Audio generated succesfully",
      "SUCCESS": true,
      "ERROR": null,
      "DATA": {
        "audio": "https://res.cloudinary.com/dpnae0bod/video/upload/v1757789061/tts-audios/fvxyjesrzvmzxwqkiid6.mp3"
      }
    }
  },
  {
    method: 'GET',
    endpoint: VOICES,
    description: 'Get available voice options - here sample response is trimmed',
    credits: 0,
    sampleRequest: {},
    sampleResponse: {
      "MESSAGE": "Voices fetched succesfully",
      "SUCCESS": true,
      "ERROR": null,
      "DATA": [
        {
          "name": "af-ZA-AdriNeural",
          "gender": "Female",
          "language": "Afrikaans (South Africa)"
        },
        {
          "name": "af-ZA-WillemNeural",
          "gender": "Male",
          "language": "Afrikaans (South Africa)"
        },
        {
          "name": "sq-AL-AnilaNeural",
          "gender": "Female",
          "language": "Albanian (Albania)"
        },
        {
          "name": "sq-AL-IlirNeural",
          "gender": "Male",
          "language": "Albanian (Albania)"
        },
        {
          "name": "am-ET-AmehaNeural",
          "gender": "Male",
          "language": "Amharic (Ethiopia)"
        },
        {
          "name": "am-ET-MekdesNeural",
          "gender": "Female",
          "language": "Amharic (Ethiopia)"
        },
        {
          "name": "ar-DZ-AminaNeural",
          "gender": "Female",
          "language": "Arabic (Algeria)"
        },
      ]
    }
  }
];

export default function TextToAudioPage() {
  return (
    <ApiDocumentation
      title="Text to Audio API"
      description="Transform text into high-quality, natural-sounding speech with multiple voice options and languages. Ideal for podcasts, audiobooks, and accessibility features."
      endpoints={endpoints}
    />
  );
}