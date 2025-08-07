from groq import Groq
import os
import json
from dotenv import load_dotenv

# Load .env for GROQ_API_KEY
load_dotenv()

# Initialize Groq client
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def getScript(title: str, style: str, seconds: int) -> str:
    instruction = (
    f"Generate a short story video script titled '{title}' in '{style}' style. "
    "Break it into exactly 5 visual scenes. Each scene must be an object with:\n"
    "- 'prompt': a detailed image generation prompt (string)\n"
    "- 'description': a short vivid description (string). Assume 10 words per second.\n"
    f"The total speaking time for all 5 descriptions must be close to {seconds} seconds without going over.\n\n"
    "**Return only a valid JSON array of 5 objects. No extra text.**"
)

    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a strict JSON generator. Return exactly 5 objects in a JSON array. "
                    "Each object must have 'prompt' and 'description'. Do NOT include any notes, comments, seconds, or extra formatting. "
                    "Example format: [{'prompt': '...', 'description': '...'}, ...]"
                )
            },
            {
                "role": "user",
                "content": instruction
            }
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
        max_tokens=2000,
    )

    script = completion.choices[0].message.content
    print(f"Generated script: {script}")
    return script
