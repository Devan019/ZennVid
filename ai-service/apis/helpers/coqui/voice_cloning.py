from TTS.api import TTS
from torch.serialization import safe_globals
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import XttsAudioConfig  # <- NEW line

print("Loading TTS model...")

with safe_globals([XttsConfig, XttsAudioConfig]):  # <- Add both here
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

print("TTS model loaded successfully.")

tts.tts_to_file(
    text="It took me quite a long time to develop a voice, and now that I have it I'm not going to be silent.",
    file_path="output.wav",
    speaker_wav="audio.wav",
    language="en"
)

print("Speech generated and saved to output.wav")
