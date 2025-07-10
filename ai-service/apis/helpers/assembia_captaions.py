import asyncio
import assemblyai as aai
import os
from dotenv import load_dotenv

load_dotenv()
aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY")


def format_timestamp(ms: int) -> str:
    """
    Converts milliseconds to SRT-style timestamp: HH:MM:SS.mmm
    """
    seconds, milliseconds = divmod(ms, 1000)
    minutes, seconds = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"


def assembia_caption(audio_path: str) -> list[dict]:
    """
    Transcribes the audio and returns a list of caption objects with
    index, start time, end time, and text (formatted like subtitles).
    """
    config = aai.TranscriptionConfig(
        speech_model=aai.SpeechModel.best,
        punctuate=True,
        format_text=True,
        
    )

    transcriber = aai.Transcriber(config=config)
    transcript = transcriber.transcribe(audio_path)

    if transcript.status == "error":
        raise RuntimeError(f"Transcription failed: {transcript.error}")

    # Create caption list
    captions = []
    for i, segment in enumerate(transcript.get_sentences(), start=1):
        captions.append({
            "index": i,
            "start": format_timestamp(segment.start),
            "end": format_timestamp(segment.end),
            "text": segment.text.strip()
        })
        print(captions)

    return captions


if __name__ == "__main__":
    asyncio.run(assembia_caption("audio.mp3"))