import assemblyai as aai
import os
from dotenv import load_dotenv

load_dotenv()
aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY")

audio_file = "./audio_test.mp3"

config = aai.TranscriptionConfig(
    speech_model=aai.SpeechModel.best,
    punctuate=True,
    format_text=True,
    word_boost=[],
    boost_param=None
)

transcriber = aai.Transcriber(config=config)
transcript = transcriber.transcribe(audio_file)

if transcript.status == "error":
    raise RuntimeError(f"Transcription failed: {transcript.error}")

# ✅ Print full transcript
print("📝 Transcript:\n", transcript.text)

# ✅ Print word-level timestamps
print("\n⏱️ Word-Level Timestamps:")
for word in transcript.words:
    print(f"{word.text}: {word.start / 1000:.2f}s - {word.end / 1000:.2f}s")

# ✅ Print paragraph-level timestamps (Optional)
print("\n📄 Paragraphs with timestamps:")
for para in transcript.get_paragraphs():
    print(f"{para.start / 1000:.2f}s - {para.end / 1000:.2f}s: {para.text}")
