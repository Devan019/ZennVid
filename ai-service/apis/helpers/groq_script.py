from groq import Groq
import os
import json
from dotenv import load_dotenv

# Load .env for GROQ_API_KEY
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_story_script_groq(title: str, style: str, seconds: int, language: str) -> list[dict]:
    """
    Same functionality as your Gemini version, but using Groq.

    Returns:
        list[dict]: A list of 5 objects with 'prompt' & 'description'
    """

    words = 10 if language.strip().lower() == "english" else 7  # Same logic

    instruction = (
        f"Generate a short story video script titled '{title}' in '{style}' style. "
        "Break it into exactly 5 visual scenes. Each scene must be a JSON object with:\n"
        "- 'prompt': a detailed image generation prompt (string)\n"
        "- 'description': a vivid short narration (string)\n"
        f"Assume {words} words per second.\n"
        f"The total speaking time for all 5 descriptions must be close to {seconds} seconds without exceeding it.\n\n"
        "**Return ONLY a valid JSON array of exactly 5 objects. No explanation, no markdown.**"
    )

    response = client.chat.completions.create(
       model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a strict JSON generator. "
                    "Return ONLY a JSON array of 5 objects. "
                    "Each object must have 'prompt' and 'description'. "
                    "No extra text, no markdown, no commentary."
                )
            },
            {"role": "user", "content": instruction}
        ],
    )

    raw_output = response.choices[0].message.content
    print("Raw GROQ Output:", raw_output)  # Debug print

    return json.loads(raw_output)
