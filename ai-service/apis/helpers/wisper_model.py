import uuid
import os
import torch
import whisper
from typing import Union
from starlette.datastructures import UploadFile

device = "cuda" if torch.cuda.is_available() else "cpu"


TEMP_DIR = "temp"
os.makedirs(TEMP_DIR, exist_ok=True)

def format_timestamp(seconds: float) -> float:
    return seconds * 1000 # Convert seconds to milliseconds


async def generate_captions(file: Union[str, UploadFile]) -> list[dict]:
    """
    Transcribes an audio file (from file path or UploadFile) and returns path to .srt.

    Args:
        file: Either a path to an audio file or an UploadFile object.

    Returns:
        str: Path to the generated .srt file.
    """

    # If file is a string path, use directly
    if isinstance(file, str):
        file_path = file

    # If it's an UploadFile-like object (async), save it
    else:
        file_path = "test"
        with open(file_path, "wb") as f_out:
            f_out.write(await file.read())

    # Load Whisper model
    model = whisper.load_model("base", device=device)

    # Transcribe
    result = model.transcribe(file_path, task="translate")

    # Build JSON captions
    captions = []
    for i, segment in enumerate(result["segments"], start=1):
        captions.append({
            "index": i,
            "start": format_timestamp(segment["start"]),
            "end": format_timestamp(segment["end"]),
            "text": segment["text"].strip()
        })

    print(captions)
    return captions

import asyncio

if __name__ == "__main__":
    asyncio.run(generate_captions("audio.mp3"))
