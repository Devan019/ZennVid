import open_clip
import torch
from PIL import Image
import os
import json
import dotenv
dotenv.load_dotenv()

print("Loading model...")

model, _, preprocess = open_clip.create_model_and_transforms(
    os.getenv("IMAGE_EMBEDDING_MODEL"), pretrained=os.getenv("IMAGE_EMBEDDING_PRETRAINED")
)
model.eval()

print("Model loaded successfully!")

dataset_path = "character-dataset"
results = []

for anime_name in os.listdir(dataset_path):
    
    anime_path = os.path.join(dataset_path, anime_name)

    if not os.path.isdir(anime_path):
        continue

    for character_name in os.listdir(anime_path):

        char_folder = os.path.join(anime_path, character_name)

        if not os.path.isdir(char_folder):
            continue

        embeddings = []
        images_info = []

        for img_name in os.listdir(char_folder):

            if not img_name.lower().endswith((".png", ".jpg", ".jpeg")):
                continue

            img_path = os.path.join(char_folder, img_name)

            image = preprocess(Image.open(img_path)).unsqueeze(0)

            with torch.no_grad():
                embedding = model.encode_image(image)
                embedding = embedding / embedding.norm(dim=-1, keepdim=True)

            embeddings.append(embedding.squeeze().tolist())

            images_info.append({
                "file": img_name,
                "path": img_path
            })

        results.append({
            "anime": anime_name,
            "character": character_name,
            "embeddings": embeddings,
            "images": images_info
        })

with open("embeddings.json", "w") as f:
    json.dump(results, f, indent=2)

print("Embeddings generated successfully!")
