import { Client } from "@gradio/client";
import { IMAGE_PIPELINE_REPO, IMAGE_PIPELINE_REPO_API, HF_TOKEN } from "../../env_var";
import fs from "fs";
import path from "path";

const getImageEmbedding = async (imagePath: string, mode: string) => {
  try {
    console.log("Getting image embedding for:", imagePath, "mode:", mode);
    //get image blob
    const response = await fetch(imagePath);
    const image = await response.blob();

    //do embeddings
    if(!IMAGE_PIPELINE_REPO || !IMAGE_PIPELINE_REPO_API || !HF_TOKEN) {
      console.log("Image pipeline repository or API endpoint or HF token not defined");
      return null;
    }
    console.log("Connecting to image pipeline repository:", IMAGE_PIPELINE_REPO, IMAGE_PIPELINE_REPO_API);

    const client = await Client.connect(IMAGE_PIPELINE_REPO, {
      token: `hf_${HF_TOKEN}`
    });
    console.log("Connected to image pipeline repository, sending image for embedding...");
    const result = await client.predict(IMAGE_PIPELINE_REPO_API, {
      img: image,
      mode: mode
    });


    return (result.data as Array<any>)[0].embedding ?? null;

  } catch (error) {
    console.error("Error in getImageEmbedding:", error);
    return null;
  }
}

const getLocalImageEmbedding = async (localPath: string, mode: string) => {
  try {
    const DATASET_ROOT = path.join(process.cwd(), "public");
    console.log("Getting local image embedding for:", localPath, "mode:", mode);
    //get image blob
   const imagePath = path.join(DATASET_ROOT, localPath);
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBlob = new Blob([imageBuffer], { type: "image/jpeg" });

    //do embeddings
    if(!IMAGE_PIPELINE_REPO || !IMAGE_PIPELINE_REPO_API || !HF_TOKEN) {
      console.log("Image pipeline repository or API endpoint or HF token not defined");
      return null;
    }
    console.log("Connecting to image pipeline repository:", IMAGE_PIPELINE_REPO, IMAGE_PIPELINE_REPO_API);

    const client = await Client.connect(IMAGE_PIPELINE_REPO, {
      token: `hf_${HF_TOKEN}`
    });
    console.log("Connected to image pipeline repository, sending local image for embedding...");
    const result = await client.predict(IMAGE_PIPELINE_REPO_API, {
      img: imageBlob,
      mode: mode
    });

    return (result.data as Array<any>)[0].embedding ?? null;

  } catch (error) {
    console.error("Error in getLocalImageEmbedding:", error);
    return null;
  }
}

// getImageEmbedding("https://res.cloudinary.com/dpnae0bod/image/upload/v1772036760/zennvid/sync-studio/bcehd3westadihxvhi8j.png", "Human").then(result => {
//   console.log("Local embedding result:", result);
// }).catch(error => {
//   console.error("Error getting local image embedding:", error);
// });

export { getImageEmbedding, getLocalImageEmbedding };