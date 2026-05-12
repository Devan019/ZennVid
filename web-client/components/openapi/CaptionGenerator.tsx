import ApiDocumentation from "@/components/openapi/ApiDocs";


const endpoints = [
  {
    method: 'POST',
    endpoint: '/api/v1/caption-generator',
    description: 'Generate captions for videos or images using AI',
    credits: 10,
    sampleRequest: {
      "audio": "https://res.cloudinary.com/dpnae0bod/video/upload/v1757789061/tts-audios/fvxyjesrzvmzxwqkiid6.mp3",
      language: 'en',
    },

    sampleResponse: {
      "MESSAGE": "Captions generated succesfully",
      "SUCCESS": true,
      "ERROR": null,
      "DATA": [
        {
          "index": 1,
          "start": 200,
          "end": 420,
          "text": "Welcome"
        },
        {
          "index": 2,
          "start": 420,
          "end": 680,
          "text": "to"
        },
        {
          "index": 3,
          "start": 680,
          "end": 820,
          "text": "Zen"
        },
        {
          "index": 4,
          "start": 820,
          "end": 1280,
          "text": "Vid,"
        },
        {
          "index": 5,
          "start": 1280,
          "end": 1540,
          "text": "the"
        },
        {
          "index": 6,
          "start": 1540,
          "end": 1820,
          "text": "future"
        },
        {
          "index": 7,
          "start": 1820,
          "end": 2040,
          "text": "of"
        },
        {
          "index": 8,
          "start": 2040,
          "end": 2600,
          "text": "AI-powered"
        },
        {
          "index": 9,
          "start": 2600,
          "end": 3080,
          "text": "Content"
        },
        {
          "index": 10,
          "start": 3080,
          "end": 3600,
          "text": "creation"
        }
      ]
    }
  }
];

export default function CaptionGeneratorPage() {
  return (
    <ApiDocumentation
      title="Caption Generator API"
      description="Generate accurate captions for your videos and images using advanced AI models. Perfect for accessibility, content creation, and video editing workflows."
      endpoints={endpoints}
    />
  );
}