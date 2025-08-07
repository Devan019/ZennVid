import os
import edge_tts
import cloudinary
import cloudinary.uploader

# Cloudinary config
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

async def generate_audio_edge(text: str, voice: str, audio_filename: str = "audio.mp3") -> str:
    """
    Generates audio using edge-tts, saves it locally, and uploads it to Cloudinary.

    Args:
        text (str): The text to convert to speech.
        voice (str): The voice ID (e.g., 'en-US-AriaNeural').
        audio_filename (str): The filename to save the audio as. Defaults to 'audio.mp3'.

    Returns:
        str: The Cloudinary URL of the uploaded audio file.
    """
    try:
        # Generate and save the audio file locally
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(audio_filename)

        # Upload to Cloudinary
        if os.path.exists(audio_filename):
            result = cloudinary.uploader.upload(
                audio_filename,
                folder="zennvid",
                resource_type="video",  # Required for audio
                public_id="audio"
            )
            return result["secure_url"]
        else:
            raise FileNotFoundError(f"⚠️ File not found: {audio_filename}")

    except Exception as e:
        print(f"❌ Error generating or uploading audio: {e}")
        return ""
