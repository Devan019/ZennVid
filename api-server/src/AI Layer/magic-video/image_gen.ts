import { CLOUDFLARE_WORKER_KEY, CLOUDFLARE_WORKER_URL } from "../../env_var";
import { uploadToCloudinary } from "../../utils/cloudinary";

const imageGen = async (prompt: string) => {
  try {

    // call cloudflare worker
    const res = await fetch(CLOUDFLARE_WORKER_URL!, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_WORKER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      throw new Error("Failed to generate image");
    }

    // blob -> arrayBuffer -> buffer
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // buffer -> base64
    const base64Image = `data:image/jpeg;base64,${buffer.toString("base64")}`;

    // upload to cloudinary
    const imageData = await uploadToCloudinary({
      filePath: base64Image,
      resource_type: "image",
      folder: "zennvid",
    });

    return imageData;

  } catch (error) {
    console.log("Image generation error:", error);
    return null;
  }
};

//to test the function
// imageGen("a cat sitting on a chair").then((res) => {
//   console.log(res);
// })
// .catch((err) => {
//   console.log("Error in image generation:", err);
// });

export { imageGen };