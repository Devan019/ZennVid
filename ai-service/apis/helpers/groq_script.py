from groq import Groq
import os
from dotenv import load_dotenv

# Load .env for GROQ_API_KEY
load_dotenv()

# Initialize Groq client
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

# Story generator function
def getScript(theme: str, story: str) -> str:
    script = ""

    # Force JSON-only structured reply
    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "user",
                "content": (
                    f"Generate a short story titled \"{story}\" with the background, scene, and characters based on the theme \"{theme}\". "
                    "Break it into 5 visual scenes. For each scene, return an object with two keys:\n"
                    "- `prompt`: the image generation prompt (for tools like DALL·E or SD)\n"
                    "- `description`: natural description of what's happening in the scene.\n"
                    "Ensure the story is visually coherent and lasts a maximum of 30 seconds.\n"
                    "**Only return a valid JSON array of 5 such objects. Do not include any explanation, markdown, or extra text.**\n\n"
                    "Example format:\n"
                    "[\n"
                    "  {\n"
                    "    \"prompt\": \"a brave knight walking into a glowing enchanted forest at dusk, cinematic lighting\",\n"
                    "    \"description\": \"The knight enters a glowing forest filled with magical trees.\"\n"
                    "  },\n"
                    "  ... (4 more)\n"
                    "]"
                )
            }
        ],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )

    # Accumulate streamed JSON response
    for chunk in completion:
        script += chunk.choices[0].delta.content or ""

    return script
