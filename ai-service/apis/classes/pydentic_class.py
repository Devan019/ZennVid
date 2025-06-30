from pydantic import BaseModel
class VoiceRequest(BaseModel):
    text: str
    voice: str = "en-US-AriaNeural"

class ImageRequest(BaseModel):
    prompt: str

class SubtitleResponse(BaseModel):
    filename: str
    message: str