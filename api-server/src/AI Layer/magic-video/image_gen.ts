import { uploadToCloudinary } from "../../utils/cloudinary";
import { nebius } from "../helpers/nebius_client"

const imageGen = async (prompt: string) => {
  try {
    //image generation
    const result = await nebius.images.generate({
      "model": "black-forest-labs/flux-schnell",
      "response_format": "url",
      // "response_extension": "png",
      // "width": 1024,
      // "height": 1024,
      // "num_inference_steps": 4,
      // "negative_prompt": "",
      // "seed": -1,
      // "loras": null,
      "prompt": prompt
    });
    
    const imageUrl = result.data?.[0].url;

    if (!imageUrl) {
      throw new Error("No image URL returned from Nebius API");
    }

    //upload to cloudinary
    const videoData = await uploadToCloudinary({
      filePath: imageUrl,
      resource_type: "image",
      folder: "zennvid"
    })
    return videoData;

  } catch (error) {
    console.log("Image generation error:", error);
    return null;
  }
}

imageGen("A serene beach at sunset with vibrant colors and gentle waves").then(url => {
  console.log("Generated image URL:", url);
}).catch(error => {
  console.error("Error generating image:", error);
});

export { imageGen };