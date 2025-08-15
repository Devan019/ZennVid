from fastapi import UploadFile
from TTS.api import TTS  # <-- Required for dataset config
import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import logging

# ---------------------------
# Setup Logging
# ---------------------------
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger(__name__)

# ---------------------------
# Load Environment Variables
# ---------------------------
logger.info("Loading environment variables from .env")
load_dotenv()

# ---------------------------
# Configure Cloudinary
# ---------------------------
logger.info("Configuring Cloudinary...")
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)
logger.info("Cloudinary configuration loaded successfully.")

# ---------------------------
# Load TTS Model
# ---------------------------
logger.info("Loading TTS model (xtts_v2) on CUDA...")
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
tts.to("cuda")
logger.info("TTS model loaded and moved to GPU.")

# ---------------------------
# Directories and Voice Map
# ---------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SPEAKER_DIR = os.path.join(BASE_DIR, "audios")
logger.info(f"Base directory: {BASE_DIR}")
logger.info(f"Speaker audio directory: {SPEAKER_DIR}")

voiceMapper = {
    "Mark Zuckerberg": os.path.join(SPEAKER_DIR, "marks.wav"),
    "Elon Musk": os.path.join(SPEAKER_DIR, "elon_musk.wav"),
    "Donald Trump": os.path.join(SPEAKER_DIR, "trump.wav"),
    "Barack Obama": os.path.join(SPEAKER_DIR, "obama.wav"),
    "Joe Biden": os.path.join(SPEAKER_DIR, "biden.wav"),
    "Narendra Modi": os.path.join(SPEAKER_DIR, "modi.wav"),
    "Vladimir Putin": os.path.join(SPEAKER_DIR, "putin.wav"),
    "Cristiano Ronaldo": os.path.join(SPEAKER_DIR, "cristiano.wav"),
    "Lionel Messi": os.path.join(SPEAKER_DIR, "messi.wav"),
    "Bill Gates": os.path.join(SPEAKER_DIR, "gates.wav"),
    "Jeff Bezos": os.path.join(SPEAKER_DIR, "bezos.wav"),
    "Sundar Pichai": os.path.join(SPEAKER_DIR, "pichai.wav"),
    "Tim Cook": os.path.join(SPEAKER_DIR, "cook.wav"),
    "Satya Nadella": os.path.join(SPEAKER_DIR, "nadella.wav"),
    "Warren Buffet": os.path.join(SPEAKER_DIR, "buffet.wav"),
}

# ---------------------------
# Function to Generate Voice Clone Audio
# ---------------------------
async def getVoiceCloneAudio(
    text: str = "Technology has always been about bringing people closer together. At Meta, our mission is to build the future of human connection — a future powered by AI, virtual reality, and the metaverse",
    speaker: str = "Elon Musk",
    output_path: str = "output.wav"
) -> str:
    logger.info(f"Starting voice cloning process for speaker: {speaker}")
    logger.info(f"Input text: {text[:60]}{'...' if len(text) > 60 else ''}")

    import helpers.wisper_model as caption_helper

    # Resolve speaker audio file
    speaker_path = voiceMapper.get(speaker)
    if not speaker_path:
        logger.warning(f"Speaker '{speaker}' not found in voiceMapper. Defaulting to 'marks.wav'.")
        speaker_path = os.path.join(SPEAKER_DIR, "marks.wav")
    
    logger.info(f"Using speaker audio file: {speaker_path}")
    
    try:
        # Generate voice
        logger.info("Generating voice with TTS...")
        tts.tts_to_file(
            text=text,
            file_path=output_path,
            speaker_wav=speaker_path,
            language="en"
        )
        logger.info(f"Audio generated and saved to {output_path}")

        #caption-generating
        captions = await caption_helper.generate_captions(output_path)

        # Upload to Cloudinary
        logger.info(f"Uploading {output_path} to Cloudinary folder 'zennvid'...")
        upload_result = cloudinary.uploader.upload(
            output_path,
            resource_type="auto",  # auto-detect audio
            folder="zennvid"
        )

        secure_url = upload_result.get("secure_url")
        logger.info(f"Upload successful. File URL: {secure_url}")

        return {
            "audio": secure_url,
            "captions": captions
        }

    except Exception as e:
        logger.error(f"Error in getVoiceCloneAudio: {e}", exc_info=True)
        raise e
