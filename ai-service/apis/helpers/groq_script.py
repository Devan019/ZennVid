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

def getScript(title: str, style: str, maxChars: int) -> str:
    instruction = (
        f"Generate a short video script titled '{title}' in '{style}' style. "
        "Break it into 5 visual scenes. For each scene provide:\n"
        "- `prompt`: Detailed image generation prompt (no length limit)\n"
        f"- `description`: Scene description (TOTAL of ALL descriptions must be UNDER {maxChars} characters)\n\n"
        "Return ONLY a JSON array of 5 objects with these keys. "
        "Count description characters carefully to stay under the limit."
    )

    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a strict JSON generator. Return exactly 5 scene objects. "
                    f"Total description text must be under {maxChars} characters. "
                    "Structure: [{'prompt':'...','description':'...'}]"
                )
            },
            {
                "role": "user",
                "content": instruction
            }
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
        max_tokens=2000,  # Higher limit for longer prompts
    )

    script = completion.choices[0].message.content
    
    # Verify description length
    # try:
    #     data = json.loads(script)
    #     total_desc_chars = sum(len(scene["description"]) for scene in data)
    #     if total_desc_chars > maxChars:
    #         # If over limit, truncate descriptions proportionally
    #         ratio = maxChars / total_desc_chars
    #         for scene in data:
    #             scene["description"] = scene["description"][:int(len(scene["description"])*ratio)]
    #         script = json.dumps(data, ensure_ascii=False)
    # except (json.JSONDecodeError, KeyError):
    #     pass  # Return as-is if JSON parsing fails
    
    return script