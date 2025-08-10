import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "../env_var";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath: string, resource_type: string) => {
  if(resource_type !== "video" && resource_type !== "image" && resource_type !== "raw" && resource_type !== "auto") {
    throw new Error("Invalid resource type");
  }
  const res = await cloudinary.uploader.upload(filePath, {
    resource_type : resource_type,
    folder: "zennvid",
  });
  return res.secure_url;
};
