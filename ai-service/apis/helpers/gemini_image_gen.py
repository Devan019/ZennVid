from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import os
from dotenv import load_dotenv
load_dotenv()

import cloudinary
import cloudinary.uploader
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)
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
            continue
        elif part.inline_data is not None:
            # Save image locally
            local_filename = f"p{index}.png"
            image = Image.open(BytesIO(part.inline_data.data))
            image.save(local_filename)

            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                local_filename,
                folder="zennvid",
                resource_type="image",
                public_id=f"image_{index}"
            )

            # Optional: Remove the local file after upload
            os.remove(local_filename)

            return upload_result["secure_url"]

    raise Exception("No image was generated.")