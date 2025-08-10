import json
import os

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse 
import edge_tts
from typing import Any
from pydantic import BaseModel
from classes.pydentic_class import VoiceRequest
app = FastAPI()
tmp_str : str = ""

tmp_image_prompt = ["a sleek, silver airship soaring through a bright blue sky with fluffy white clouds, flying towards a cluster of floating cities in the distance",
                "a futuristic city floating in the air with towering skyscrapers, neon lights, and a massive central dome, with the airship docking at a landing pad",
                "a charismatic sky pirate with a confident grin and a leather jacket standing on the airship's deck, shaking hands with a city official in a crisp white uniform",
                "a high-tech control room with holographic displays and futuristic consoles, where Commissioner Ortega reveals a holographic map of the floating cities and a secret underground network",
                "the sky pirate's airship flying through a narrow, neon-lit tunnel beneath the floating cities, with the ship's engines glowing bright blue as it picks up speed"]

tmp_image_description = [
    "The sky pirate's airship, 'Maverick's Revenge', approaches the majestic floating cities.",
    "The airship docks at the floating city of Nova Haven, a hub of intercity commerce and innovation.",
    "Captain Jax of the Maverick's Revenge meets with Commissioner Ortega to discuss a lucrative smuggling deal.",
    "a high-tech control room with holographic displays and futuristic consoles, where Commissioner Ortega reveals a holographic map of the floating cities and a secret underground network",
    "the sky pirate's airship flying through a narrow, neon-lit tunnel beneath the floating cities, with the ship's engines glowing bright blue as it picks up speed"
]

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

os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(SUBS_DIR , exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Services API"}

class GroqScript(BaseModel):
    style: str
    title: str
    seconds: int
    language: str = "english"


@app.post("/script-gen")
async def groq_script(req: GroqScript):
    from helpers.gemini_script import generate_story_script

    script = generate_story_script(req.title, req.style, req.seconds, req.language)

    # Clean markdown fencing if present
    
    return {"script": script}


class VoiceRequestWithText(BaseModel):
    gender: str
    language: str
    text: str

class VoiceRequest(BaseModel):
    text: str
    voice: str

@app.post("/generate-audio")
async def generate_audio(request: VoiceRequest):
    audio_filename = os.path.join(AUDIO_DIR, f"audio.mp3")
    communicate = edge_tts.Communicate(request.text, request.voice)
    await communicate.save(audio_filename)

    return FileResponse(audio_filename, media_type="audio/mpeg", filename=os.path.basename(audio_filename))

class VoiceRequestTest(BaseModel):
    voice: str

@app.post("/generate-audio-test")
async def generate_audio_test(request: VoiceRequestTest):
    text = ""
    for item in tmp_image_description:
        text += item + "."
    audio_filename = os.path.join(AUDIO_DIR, f"audio_test.mp3")
    communicate = edge_tts.Communicate(text, request.voice)
    await communicate.save(audio_filename)

    return FileResponse(audio_filename, media_type="audio/mpeg", filename=os.path.basename(audio_filename))


import zipfile
from tempfile import NamedTemporaryFile

class ImageRequest(BaseModel):
    prompt: list[str]
    image_size: str = "1024x1024"

@app.post("/generate-image")
async def generate_image_gemini(request: ImageRequest):
    from helpers.gemini_image_gen import generate_image
    images = []

    for prompt in request.prompt:
        img_path = generate_image(prompt, request.image_size)
        images.append(img_path)

    # Create a zip file in memory
    with NamedTemporaryFile(delete=False, suffix=".zip") as tmp_zip:
        with zipfile.ZipFile(tmp_zip.name, 'w') as zipf:
            for img_path in images:
                zipf.write(img_path, arcname=os.path.basename(img_path))
        zip_path = tmp_zip.name

    return FileResponse(zip_path, media_type="application/zip", filename="generated_images.zip")

@app.post("/generate-image-test")
async def generate_image_gemini_test(request: ImageRequest):
    from helpers.gemini_image_gen import generate_image
    images = []

    index = 0
    for prompt in tmp_image_description:
        img_path = generate_image(prompt, request.image_size, index)
        images.append(img_path)
        index += 1

    # Create a zip file in memory
    with NamedTemporaryFile(delete=False, suffix=".zip") as tmp_zip:
        with zipfile.ZipFile(tmp_zip.name, 'w') as zipf:
            for img_path in images:
                zipf.write(img_path, arcname=os.path.basename(img_path))
        zip_path = tmp_zip.name

    return FileResponse(zip_path, media_type="application/zip", filename="generated_images.zip")

class CaptionRequest(BaseModel):
    audio_file: str

@app.post("/generate-captions")
def create_captions(req: CaptionRequest) -> str:
    from helpers.wisper_model import generate_captions
    srt_path = generate_captions(req.audio_file)
    return srt_path

@app.post("/generate-captions-test")
async def create_captions_test(file: UploadFile = File(...)):
    from helpers.wisper_model import generate_captions
    captions = await generate_captions(file)
    return JSONResponse(content=captions)


class VideoClone(BaseModel):
    audio: str
    text: str

@app.post("/voice-clone")
def voice_clone(request: VideoClone):
    from helpers.coqui.voice_cloning import getVoiceCloneAudio
    output_path =  getVoiceCloneAudio(request.text, request.audio)
    return output_path


class VideoPro(BaseModel):
    topic: str
    theme: str
    voice: str
    image_size: str = "1024x1024"
    language: str = "english"
    seconds: int
@app.post("/video-gen-pro")  # with script gen
async def videoGenPro(req: VideoPro):
    import logging
    logging.basicConfig(level=logging.INFO)
    
    from helpers.gemini_script import generate_story_script
    from helpers.gemini_image_gen import generate_image
    from helpers.translate import getTranslateText
    from helpers.wisper_model import generate_captions
    from helpers.edge_tts import generate_audio_edge
    from helpers.ffmepg import create_video

    logging.info("Step 1: Generating story script...")
    script = generate_story_script(req.topic, req.theme, req.seconds, req.language)

    logging.info("Step 2: Generating images...")
    images = []
    idx = 0
    # for item in script:
    for item in script: 
        prompt = item['prompt']
        img_path = generate_image(prompt, req.image_size, idx)
        idx += 1
        images.append(img_path)

    logging.info("Step 3: Preparing audio text...")
    audio_desc = ""
    audio_desc2 = ""
    for item in script:
        description = getTranslateText(item['description'], Audio_Mapper[req.language])
        audio_desc += description + ". "
        audio_desc2 += item['description'] 

    logging.info("Step 4: Generating audio...")
    audio = await generate_audio_edge(audio_desc, req.voice, "audio.mp3")

    logging.info("Step 5: Generating captions...")
    captions = await generate_captions("./helpers/audio.mp3")
    # return captions

    logging.info("Step 6: Creating final video...")
    video_url = create_video(
        captions_json=json.dumps(captions),
        images=images,
        audio="./helpers/audio.mp3"
    )

    logging.info("Step 7: Video generation complete.")

    return {
        "video": video_url
    }

@app.get("/video-gen-test")
def getULtest():
    return {
        "video": "https://res.cloudinary.com/dpnae0bod/video/upload/v1754833702/output_video.mp4"
    }

class VideoLite(BaseModel):
    script: Any
    topic: str
    theme: str
    voice: str
    image_size: str = "1024x1024"

@app.post("/video-gen-lite")
async def videoGenLite(req: VideoLite): #without script gen
    from helpers.gemini_image_gen import generate_image
    from helpers.translate import getTranslateText
    from helpers.wisper_model import generate_captions
    from helpers.edge_tts import generate_audio_edge

    groqScript = json.loads(req.script)

    images = []
    #step 2 gen images
    idx = 0
    for item in groqScript:
        prompt = item['prompt']
        img_path = generate_image(prompt, req.image_size, idx)
        idx += 1
        images.append(img_path)

    # step 3 gen audio
    audio_desc = ""
    audio_desc2 = ""
    for item in groqScript:

        description = getTranslateText(item['description'], Audio_Mapper[req.language])
        audio_desc += description + ". "
        audio_desc2 += item['description'] 

    audio = await generate_audio_edge(audio_desc, req.voice,"audio.mp3")

    # step 4 gen captions
    captions = await generate_captions(audio)

    return {
        "images": images,
        "audio": audio,
        "captions": captions
    }

class TranslateReq(BaseModel):
    text: str
    language : str

@app.post("/translate-text")
def translate_text(request: TranslateReq):
    from helpers.translate import getTranslateText
    translated_text = getTranslateText(request.text, request.language)
    return translated_text


import uvicorn

if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8080, reload=True)