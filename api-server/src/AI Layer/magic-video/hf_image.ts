import { Client } from "@gradio/client";
import { HF_IMAGE_GEN_REPO, HF_IMAGE_GEN_REPO_API, HF_TOKEN } from "../../env_var";
import { uploadToCloudinaryWithBuffer } from "../../utils/cloudinary";
import axios from "axios";

const downloadImageAsBuffer = async (url: string) => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });
  return Buffer.from(response.data, "binary");
};

const HFImageGen = async (prompt: string) => {

  if (!HF_TOKEN || !HF_IMAGE_GEN_REPO || !HF_IMAGE_GEN_REPO_API) {
    throw new Error("HF_TOKEN, HF_IMAGE_GEN_REPO, or HF_IMAGE_GEN_REPO_API is not defined in environment variables");
  }

  try {

    const client = await Client.connect(HF_IMAGE_GEN_REPO, {
      token: `hf_${HF_TOKEN}`
    });
    //call api
    const result = await client.predict(HF_IMAGE_GEN_REPO_API, {
      prompt: prompt,
      size: "1024x1024",
      seed: -1,
      use_pe: true,
    });


    const imageUrl = (result?.data as Array<{ url?: string }> | undefined)?.[0]?.url;

    if (!imageUrl) {
      throw new Error("No image URL returned from Nebius API");
    }

    const imageBuffer = await downloadImageAsBuffer(imageUrl);

    //upload to cloudinary
    const imageData = await uploadToCloudinaryWithBuffer({
      buffer: imageBuffer,
      resource_type: "image",
      folder: "zennvid",
      format: "jpg"
    })
    return imageData;
  } catch (error) {
    console.log("Image generation error:", error);
    return null;
  }
};

// function main() {
//   const testPrompt = "A serene beach at sunset with vibrant colors and gentle waves";
//   HFImageGen(testPrompt).then(imageData => {
//     console.log("Generated image data:", imageData);
//   }).catch(error => {
//     console.log("Error generating image:", error);
//   });
// }

// main();

export { HFImageGen };
