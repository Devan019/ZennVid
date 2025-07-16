from fastapi import UploadFile
from TTS.api import TTS  # <-- Required for dataset config
import os


# Add all required globals for safe unpickling

tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
tts.to("cuda")




# tts.tts_to_file(
#     text=text,
#     file_path="output.wav",
#     speaker_wav="marks.wav",
#     language="en"
# )

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SPEAKER_DIR = os.path.join(BASE_DIR)

voiceMapper = {
    "Mark Zuckerberg" : os.path.join(SPEAKER_DIR, "marks.wav"),
    "Elon Musk" : os.path.join(SPEAKER_DIR, "elon.wav"),
    "Donald Trump" : os.path.join(SPEAKER_DIR, "trump.wav"),
    "Barack Obama" : os.path.join(SPEAKER_DIR, "obama.wav"),
    "Joe Biden" : os.path.join(SPEAKER_DIR, "biden.wav"),
    "Narendra Modi" : os.path.join(SPEAKER_DIR, "modi.wav"),
    "Vladimir Putin" : os.path.join(SPEAKER_DIR, "putin.wav"),
    "Cristiano Ronaldo" : os.path.join(SPEAKER_DIR, "cristiano.wav"),
    "Lionel Messi" : os.path.join(SPEAKER_DIR, "messi.wav"),
    "Bill Gates" : os.path.join(SPEAKER_DIR, "gates.wav"),
    "Jeff Bezos" : os.path.join(SPEAKER_DIR, "bezos.wav"),
    "Sundar Pichai" : os.path.join(SPEAKER_DIR, "pichai.wav"),
    "Tim Cook" : os.path.join(SPEAKER_DIR, "cook.wav"),
    "Satya Nadella" : os.path.join(SPEAKER_DIR, "nadella.wav"),
    "Warren Buffet" : os.path.join(SPEAKER_DIR, "buffet.wav"),
}

def getVoiceCloneAudio(text: str = "Technology has always been about bringing people closer together. At Meta, our mission is to build the future of human connection — a future powered by AI, virtual reality, and the metaverse", speaker_key: str = "Mark Zuckerberg", output_path: str = "output.wav") -> None:
    if not speaker:
        speaker = "marks.wav"
    tts.tts_to_file(
        text=text,
        file_path=output_path,
        speaker_wav=speaker,
        language="en"
    )
    return output_path

# getVoiceCloneAudio(text="Technology has always been about bringing people closer together. At Meta, our mission is to build the future of human connection — a future powered by AI, virtual reality, and the metaverse", speaker_key="Mark Zuckerberg", output_path="output.wav")

