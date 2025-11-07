import os
from huggingface_hub import InferenceClient
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv

load_dotenv()

client = InferenceClient(
    provider="nscale",   # FREE PROVIDER
    api_key=os.environ["HF_TOKEN"],
)

def generate_image(prompt: str, model="stabilityai/stable-diffusion-xl-base-1.0", index=0):
    """
    Generate an image using HuggingFace SDXL API (free using nscale provider).

    Returns:
        Local filename of saved image.
    """

    # HF automatically returns bytes -> convert to PIL
    result = client.text_to_image(
        prompt,
        model="stabilityai/stable-diffusion-xl-base-1.0",
    )

    # Save file
    filename = f"output_{index}.png"
    result.save(filename)
    return filename


if __name__ == "__main__":
    img_path = generate_image("Astronaut riding a horse", index=1)
    print("Saved:", img_path)
