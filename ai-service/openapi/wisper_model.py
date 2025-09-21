import os
import uuid
import asyncio
from typing import Union
from starlette.datastructures import UploadFile
from groq import Groq
import dotenv
import aiofiles
import aiohttp  

dotenv.load_dotenv()

TEMP_DIR = "temp"
os.makedirs(TEMP_DIR, exist_ok=True)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def format_timestamp(seconds: float) -> float:
    """Convert seconds to milliseconds"""
    return round(seconds * 1000, 2)


async def save_upload_file(upload_file: UploadFile, destination: str) -> None:
    """Save an UploadFile to disk asynchronously"""
    async with aiofiles.open(destination, "wb") as out_file:
        content = await upload_file.read()
        await out_file.write(content)


async def download_file(url: str, destination: str) -> None:
    """Download a file from a URL asynchronously"""
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            if resp.status == 200:
                f = await aiofiles.open(destination, mode="wb")
                await f.write(await resp.read())
                await f.close()
            else:
                raise Exception(f"❌ Failed to download file: {url}, status: {resp.status}")


async def generate_captions(file: Union[str, UploadFile], lang: str = "en") -> list[dict]:
    file_path = None
    cleanup = False  

    try:
        # Decide file type
        if isinstance(file, str):
            if file.startswith("http://") or file.startswith("https://"):
                # Online URL → download
                file_id = str(uuid.uuid4()) + ".mp3"
                file_path = os.path.join(TEMP_DIR, file_id)
                await download_file(file, file_path)
                cleanup = True
            else:
                # Local path
                file_path = file
        else:
            # UploadFile case
            file_id = str(uuid.uuid4()) + ".mp3"
            file_path = os.path.join(TEMP_DIR, file_id)
            await save_upload_file(file, file_path)
            cleanup = True

        # Call Groq Whisper API
        with open(file_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                file=(os.path.basename(file_path), audio_file.read()),
                model="whisper-large-v3-turbo",
                language=lang,
                response_format="verbose_json",
                timestamp_granularities=["word"],
            )

        captions = []

        # ✅ Word-level timestamps
        if hasattr(transcription, "words") and transcription.words:
            for idx, word in enumerate(transcription.words, start=1):
                captions.append({
                    "index": idx,
                    "start": format_timestamp(word["start"]),
                    "end": format_timestamp(word["end"]),
                    "text": word["word"].strip()
                })
        else:  # fallback plain text
            captions.append({
                "index": 1,
                "start": 0,
                "end": 0,
                "text": transcription.text.strip()
            })

        return captions

    except Exception as e:
        return [{"error": str(e)}]
    
    finally:
        # ✅ Always clean up temp file if it was downloaded/uploaded
        if cleanup and file_path and os.path.exists(file_path):
            os.remove(file_path)


if __name__ == "__main__":
    url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    captions = asyncio.run(generate_captions(url, lang="hi"))
    print(captions)
