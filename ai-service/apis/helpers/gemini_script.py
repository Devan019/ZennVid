from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
load_dotenv()

# Initialize Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_KEY"))

def generate_story_script(title: str, style: str, seconds: int, language: str) -> list[dict]:
    """
    Generates a short video story script with 5 visual scenes using Gemini.

    Args:
        title (str): The title of the story.
        style (str): The desired style (e.g., Pixar, Anime, Cyberpunk).
        seconds (int): Total speaking time allowed (e.g., 30 seconds).
        language (str): Language of the narration (e.g., "english", "hindi")

    Returns:
        list[dict]: A list of 5 dictionaries each with 'prompt' and 'description'.
    """

    # Words per second logic
    words = 10 if language.strip().lower() == "english" else 7

    instruction = (
        f"Generate a short story video script titled '{title}' in '{style}' style. "
        "Break it into exactly 5 visual scenes. Each scene must be a JSON object with:\n"
        "- 'prompt': a detailed image generation prompt (string)\n"
        f"- 'description': a vivid short narration (string). Assume {words} words per second.\n"
        f"The total speaking time for all 5 descriptions must be close to {seconds} seconds without going over.\n\n"
        "**Return only a valid JSON array of 5 objects. No explanation or other text.**"
    )

    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=instruction,
    )

    # Get text content from the response
    story = response.candidates[0].content.parts[0].text.strip()
    story = story.replace("```json", "").replace("```", "").strip()

    try:
        import json
        script = json.loads(story)
        return script
    except json.JSONDecodeError as e:
        print(f"❌ Error decoding JSON: {e}")
        print("🧾 Raw story output:\n", story)
        return []
