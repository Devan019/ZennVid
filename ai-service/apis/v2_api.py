
import json
from fastapi import FastAPI
from pydantic import BaseModel
import base64
import os
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips
from moviepy.video.tools.subtitles import SubtitlesClip
from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_subclip
from moviepy.video.fx.all import resize

import tempfile
Audio_Mapper = {
    "gujarati" : "gu",
    "bengali" : "bn",
    "tamil" : "ta",
    "telugu" : "te",
    "marathi" : "mr",
    "malayalam" : "ml",
    "punjabi" : "pa",
    "urdu" : "ur",
    "kannada" : "kn",
    "assamese" : "as",
    "maithili" : "mai",
    "sindhi" : "sd",
    "sanskrit" : "sa",
    "english" : "en",
    "french" : "fr",
    "spanish" : "es",
    "german" : "de",
    "italian" : "it",
    "japanese" : "ja",
    "korean" : "ko",
    "portuguese" : "pt",
    "russian" : "ru",
    "hindi" : "hi",
    "arabic" : "ar",
    "turkish" : "tr",
    "dutch" : "nl",
    "polish" : "pl",
    "swedish" : "sv",
    "norwegian" : "no",
    "danish" : "da",
    "finnish" : "fi",
    "chinese" : "zh-CN",
}

class VideoPro(BaseModel):
    topic: str
    theme: str
    voice: str
    image_size: str = "1024x1024"
    language: str = "en"


app = FastAPI()

@app.post("/video-gen-pro")
async def videoGenPro(req: VideoPro):

    # step  1 groq script
    from helpers.groq_script import getScript
    from helpers.gemini_image_gen import generate_image
    from helpers.translate import getTranslateText
    from helpers.wisper_model import generate_captions
    from helpers.edge_tts import generate_audio_edge
    

    raw_string = getScript(req.theme, req.topic)
    groqScriptTmp = raw_string.encode().decode('unicode_escape')
    groqScript = json.loads(groqScriptTmp)


    images = []
    #step 2 gen images
    idx = 0
    for item in groqScript:
        prompt = item['prompt']
        img_path = generate_image(prompt, req.image_size, idx)
        with open(img_path, "rb") as img_file:
              encoded_img = base64.b64encode(img_file.read()).decode('utf-8')
              images.append({
                "filename": os.path.basename(img_path),
                "data": encoded_img
              })
        idx += 1

    # step 3 gen audio
    audio_desc = ""
    audio_desc2 = ""
    for item in groqScript:

        description = getTranslateText(item['description'], Audio_Mapper[req.language])
        audio_desc += description + ". "
        audio_desc2 += item['description'] 

    audio = await generate_audio_edge(audio_desc, req.voice,"audio.mp3")
    with open(audio, "rb") as audio_file:
      audio_encoded = base64.b64encode(audio_file.read()).decode("utf-8")

    # step 4 gen captions
    srt_path = await generate_captions(audio)

    return {
        "script": groqScript,
        "images": images,
        "audio": audio_encoded,
        "captions": srt_path
    }

@app.post("/video-gen-v2")
def videoGenV2(req: VideoPro):
    pass

import uvicorn

if __name__ == "__main__":
    uvicorn.run("v2_api:app", host="127.0.0.1", port=8080, reload=True)