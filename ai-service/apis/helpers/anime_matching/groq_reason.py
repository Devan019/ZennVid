from groq import Groq
import os
import json
from dotenv import load_dotenv

# Load .env for GROQ_API_KEY
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def genarate_character_description_groq(character_name: str, anime_name: str) -> str:
    """
    Generate a character description using Groq.

    Args:
        character_name (str): The name of the character.
        anime_name (str): The name of the anime.

    Returns:
        str: A detailed description of the character.
    """

    instruction = (
        f"""Explain this anime character in 4-5 lines.
          Focus on:
          - personality
          - abilities
          - why someone might resemble them
          Character: {character_name}
          Anime: {anime_name}"""
    )

    response = client.chat.completions.create(
       model="openai/gpt-oss-120b",
        messages=[
            {"role": "user", "content": instruction}
        ],
    )

    return response.choices[0].message.content.strip()