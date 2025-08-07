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

def test_upload_assets_to_cloudinary():
    """
    Uploads 4 images and 1 audio file to Cloudinary under the folder /zennvid.
    Returns a dict with image and audio URLs.
    """
    uploaded_files = {"images": [], "audio": None}
    
    # Upload images p0.png to p3.png
    for i in range(4):
        image_path = f"p{i}.png"
        if os.path.exists(image_path):
            result = cloudinary.uploader.upload(
                image_path,
                folder="zennvid",
                resource_type="image",
                public_id=f"image_{i}"
            )
            uploaded_files["images"].append(result["secure_url"])
        else:
            print(f"⚠️ File not found: {image_path}")

    # Upload audio_test.mp3
    audio_path = "audio_test.mp3"
    if os.path.exists(audio_path):
        result = cloudinary.uploader.upload(
            audio_path,
            folder="zennvid",
            resource_type="video",  # Use 'video' for audio/video
            public_id="audio"
        )
        uploaded_files["audio"] = result["secure_url"]
    else:
        print(f"⚠️ File not found: {audio_path}")

    return uploaded_files

uploaded = test_upload_assets_to_cloudinary()
print("Uploaded Image URLs:", uploaded["images"])
print("Uploaded Audio URL:", uploaded["audio"])
