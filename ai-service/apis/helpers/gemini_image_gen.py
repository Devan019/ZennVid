from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import os
from dotenv import load_dotenv
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_KEY"))





def generate_image(prompt: str, image_size: str = "1024x1024", index: int = 0) -> Image.Image:
    """
    Generate an image based on the provided prompt using Gemini API.

    Args:
        prompt (str): The text prompt to generate the image.
        image_size (str): The size of the generated image. Default is "1024x1024".

    Returns:
        Image.Image: The generated image as a PIL Image object.
    """


    response = client.models.generate_content(
      model="gemini-2.0-flash-preview-image-generation",
      contents=prompt,
      config=types.GenerateContentConfig(
        response_modalities=['TEXT', 'IMAGE']
      )
    ) 

    for part in response.candidates[0].content.parts:
      if part.text is not None:
        pass
      elif part.inline_data is not None:
        image = Image.open(BytesIO((part.inline_data.data)))
        image.save(f"p{index}.png")
        return f"p{index}.png"