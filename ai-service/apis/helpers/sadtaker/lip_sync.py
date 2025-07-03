import requests
import base64
import os
from dotenv import load_dotenv
print("Loading environment variables...")
# Use this function to convert an image file from the filesystem to base64
def image_file_to_base64(image_path):
    with open(image_path, 'rb') as f:
        image_data = f.read()
        print(f"Image data read from ")
    return base64.b64encode(image_data).decode('utf-8')

# Use this function to fetch an image from a URL and convert it to base64
def image_url_to_base64(image_url):
    response = requests.get(image_url)
    image_data = response.content
    print(f"Image data fetched from ")
    return base64.b64encode(image_data).decode('utf-8')

# Use this function to convert a list of image URLs to base64
def image_urls_to_base64(image_urls):
    return [image_url_to_base64(url) for url in image_urls]

api_key = ""
url = "https://api.segmind.com/v1/sadtalker"

# Request payload
data = {
  "input_image": image_url_to_base64("https://segmind-sd-models.s3.amazonaws.com/display_images/sad_talker/sad-talker-input.png"),  # Or use image_file_to_base64("IMAGE_PATH")
  "input_audio": "https://segmind-sd-models.s3.amazonaws.com/display_images/sad_talker/sad_talker_audio_input.mp3",
  "pose_style": 4,
  "expression_scale": 1.4,
  "preprocess": "full",
  "image_size": 256,
  "enhancer": True,
  "base64": False
}

print("Preparing request to Segmind API...")

headers = {'x-api-key': api_key}

response = requests.post(url, json=data, headers=headers)

if response.status_code == 200:
    with open("output.mp4", "wb") as f:
        f.write(response.content)
    print("✅ Video saved as output.mp4")
else:
    print(f"❌ Error: {response.status_code} - {response.text}")
