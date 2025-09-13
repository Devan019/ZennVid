import json
import os

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse 

from typing import Any
from pydantic import BaseModel
app = FastAPI()

Audio_Mapper: dict[str, str] = {
    "afrikaans": "af",
    "albanian": "sq",
    "amharic": "am",
    "arabic": "ar",
    "azerbaijani": "az",
    "bengali": "bn",
    "bosnian": "bs",
    "bulgarian": "bg",
    "burmese": "my",
    "catalan": "ca",
    "chinese": "zh-CN",
    "croatian": "hr",
    "czech": "cs",
    "danish": "da",
    "dutch": "nl",
    "english": "en",
    "estonian": "et",
    "filipino": "fil",
    "finnish": "fi",
    "french": "fr",
    "galician": "gl",
    "georgian": "ka",
    "german": "de",
    "greek": "el",
    "gujarati": "gu",
    "hebrew": "he",
    "hindi": "hi",
    "hungarian": "hu",
    "icelandic": "is",
    "indonesian": "id",
    "irish": "ga",
    "italian": "it",
    "japanese": "ja",
    "javanese": "jv",
    "kannada": "kn",
    "kazakh": "kk",
    "khmer": "km",
    "korean": "ko",
    "lao": "lo",
    "latvian": "lv",
    "lithuanian": "lt",
    "macedonian": "mk",
    "malay": "ms",
    "malayalam": "ml",
    "maltese": "mt",
    "marathi": "mr",
    "mongolian": "mn",
    "nepali": "ne",
    "norwegian": "no",
    "pashto": "ps",
    "persian": "fa",
    "polish": "pl",
    "portuguese": "pt",
    "romanian": "ro",
    "russian": "ru",
    "serbian": "sr",
    "sinhala": "si",
    "slovak": "sk",
    "slovenian": "sl",
    "somali": "so",
    "spanish": "es",
    "sundanese": "su",
    "swahili": "sw",
    "swedish": "sv",
    "tamil": "ta",
    "telugu": "te",
    "thai": "th",
    "turkish": "tr",
    "ukrainian": "uk",
    "urdu": "ur",
    "uzbek": "uz",
    "vietnamese": "vi",
    "welsh": "cy",
    "zulu": "zu",
    "maithili": "mai",
    "sindhi": "sd",
    "sanskrit": "sa",
    "assamese": "as",
    "punjabi": "pa",
}

# Folder structure
BASE_DIR = "media"
AUDIO_DIR = os.path.join(BASE_DIR, "audio")
VIDEO_DIR = os.path.join(BASE_DIR, "video")
SUBS_DIR = "media/subs"
UPLOAD_DIR = os.path.join(BASE_DIR, "uploaded")


class VoiceRequest(BaseModel):
    text: str
    voice: str

@app.post("/generate-audio")
async def generate_audio(request: VoiceRequest):
    from audio_gen import generate_audio_edge
    path_name = await generate_audio_edge(request.text, request.voice)  
    return { "audio":path_name}
 
class CaptionRequest(BaseModel):
    audio: str
    lanuage: str = "hi"

@app.post("/generate-captions")
async def create_captions(req: CaptionRequest) -> str:
    from wisper_model import generate_captions
    captions = await generate_captions(req.audio, req.lanuage)
    return JSONResponse(content=captions)

class TranslateReq(BaseModel):
    text: str
    language : str

@app.post("/translate-text")
def translate_text(request: TranslateReq):
    from translate import getTranslateText
    translated_text = getTranslateText(request.text, request.language)
    return { "translate" : translated_text}

import uvicorn

if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=5000, reload=True)