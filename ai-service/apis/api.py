import json
import os

from fastapi import FastAPI
from fastapi.responses import FileResponse 
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



import uvicorn

if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8080, reload=True)