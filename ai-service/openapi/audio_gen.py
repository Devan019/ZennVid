import os
import uuid
from edge_tts import Communicate
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
load_dotenv()

# Cloudinary config
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

current_dir = os.path.dirname(os.path.abspath(__file__))

async def generate_audio_edge(text: str, voice: str) -> str:
    """
    Generates audio using edge-tts, saves it locally with UUID filename,
    uploads it to Cloudinary, and deletes the local file.

    Args:
        text (str): The text to convert to speech.
        voice (str): The voice ID (e.g., 'en-US-AriaNeural').

    Returns:
        str: The Cloudinary URL of the uploaded audio file.
    """
    try:
        # Ensure directory exists
        if not os.path.exists(current_dir):
            os.makedirs(current_dir)

        # Create unique filename
        audio_filename = f"{uuid.uuid4()}.mp3"
        audio_path = os.path.join(current_dir, audio_filename)

        # Generate audio locally
        communicate = Communicate(text, voice)
        await communicate.save(audio_path)

        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(
            audio_path,
            resource_type="auto",  
            folder="tts-audios"     
        )

        
        os.remove(audio_path)


        return upload_result.get("secure_url", "")

    except Exception as e:
        print(f"❌ Error generating or uploading audio: {e}")
        return ""
