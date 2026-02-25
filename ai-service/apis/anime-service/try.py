from gradio_client import Client, handle_file
from dotenv import load_dotenv
import os
load_dotenv()

client = Client("devan019/image-embedding", hf_token=os.getenv("HF_TOKEN"))
result = client.predict(
	image=handle_file('character-dataset/Blue Lock/isagi/1.jpg'),
	api_name="/get_image_embedding"
)
print(result)