import os
import edge_tts

current_dir = os.path.dirname(os.path.abspath(__file__))

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
        audio_path = os.path.join(current_dir, audio_filename)
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(audio_path)

        return audio_path

    except Exception as e:
        print(f"❌ Error generating or uploading audio: {e}")
        return ""
