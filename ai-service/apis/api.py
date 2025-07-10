import json
import os

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse, JSONResponse 
import edge_tts

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
    theme: str
    story: str

@app.post("/groq-script")
async def groq_script(scipt: GroqScript):
    from helpers.groq_script  import getScript  
    script = getScript(scipt.theme, scipt.story)
    # print(script)
    script = script.replace("```json", '')
    script = script.replace("```", '')

    raw_string = script.encode().decode('unicode_escape')
    # print(script)
    # parsed_script = json.loads(script)
    parsed_json = json.loads(raw_string)
    return parsed_json

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

@app.post("/generate-capations")
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
    language: str = "en"

@app.post("/video-gen-pro")
async def videoGenPro(req: VideoPro):

    # step  1 groq script
    from helpers.groq_script import getScript
    from helpers.gemini_image_gen import generate_image
    from helpers.translate import getTranslateText
    from helpers.wisper_model import generate_captions
    from helpers.edge_tts import generate_audio_edge
    from helpers.assembia_captaions import assembia_caption
    

    raw_string = getScript(req.theme, req.topic)
    groqScriptTmp = raw_string.encode().decode('unicode_escape')
    groqScript = json.loads(groqScriptTmp)

    # print(groqScript)

    images = []
    #step 2 gen images
    idx = 0
    for item in groqScript:
        print("item is ", item)
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

    print(f"description is ", audio_desc)
    audio = await generate_audio_edge(audio_desc, req.voice,"audio.mp3")

    # step 4 gen captions
    srt_path = await generate_captions(audio)

    return {
        "script": groqScript,
        "images": images,
        "audio": audio,
        "captions": srt_path
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