import os
import edge_tts

async def generate_audio_edge(text: str, voice: str, audio_filename: str) -> str:
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(audio_filename)

    return audio_filename