import io
import os
from fastapi import UploadFile
import torch
from .groq_reason import genarate_character_description_groq
from PIL import Image


def cosine_similarity(a, b):
    return torch.nn.functional.cosine_similarity(a, b, dim=0).item()


async def match_image(file: UploadFile, characters_data: list, preprocess, model):

    # Read uploaded image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    # Preprocess
    image_input = preprocess(image).unsqueeze(0)

    # Generate embedding
    with torch.no_grad():
        user_embedding = model.encode_image(image_input)
        user_embedding = user_embedding / user_embedding.norm(dim=-1, keepdim=True)
        user_embedding = user_embedding.squeeze()

    best_score = -1
    best_character = None
    best_image = None

    # Compare with dataset
    for char in characters_data:

        if "embedding_tensor" not in char or len(char["embedding_tensor"]) == 0:
            continue

        # Calculate similarity for each image embedding
        scores = [
            cosine_similarity(user_embedding, emb)
            for emb in char["embedding_tensor"]
        ]

        score = max(scores)
        best_img_index = scores.index(score)

        # Update best match
        if score > best_score:
            best_score = score
            best_character = char

            # pick corresponding best image
            if "images" in char and len(char["images"]) > best_img_index:
                best_image = char["images"][best_img_index]["path"]


    # Generate description
    description = genarate_character_description_groq(
        best_character.get("character", ""),
        best_character.get("anime", "")
    )

    # Convert local path to static URL
    image_url = None
    if best_image:
        relative_path = os.path.relpath(best_image, "character-dataset")
        image_url = f"/images/{relative_path.replace(os.sep, '/')}"

    return {
        "character": best_character.get("character", best_character.get("id")),
        "anime": best_character.get("anime"),
        "score": round(best_score, 4),
        "description": description,
        "image_url": image_url
    }
