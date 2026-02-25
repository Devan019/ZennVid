import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "../env_var";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const getCloudinaryUrl = (publicId: string, resourceType: string, format: string): string => {
  try {
    return cloudinary.url(publicId, {
      resource_type: resourceType,
      format: format,
      secure: true,
      sign_url: true,
    });
  } catch (error) {
    return "";
  }
}

export const extractPublicId = (secureUrl: string): string => {
  const parts = secureUrl.split("/upload/")[1];
  const withoutVersion = parts.replace(/v\d+\//, "");
  const publicIdWithExtension = withoutVersion.split(".")[0];

  return publicIdWithExtension;
};

export const uploadToCloudinary = async ({
  filePath,
  resource_type,
  folder = "zennvid",
}: {
  filePath: string;
  resource_type: string;
  folder: string;
}) => {
  if (resource_type !== "video" && resource_type !== "image" && resource_type !== "raw" && resource_type !== "auto") {
    throw new Error("Invalid resource type");
  }
  const res = await cloudinary.uploader.upload(filePath, {
    resource_type: resource_type,
    folder: folder,
  });
  return {
    url : res.secure_url,
    publicId: res.public_id,
    format: res.format,
    resourceType: res.resource_type
  }
};

export const deleteFromCloudinary = async ({
  publicId,
  resource_type
}: {
  publicId: string;
  resource_type: string;
}) => {
  if (resource_type !== "video" && resource_type !== "image" && resource_type !== "raw" && resource_type !== "auto") {
    throw new Error("Invalid resource type");
  }

  const res = await cloudinary.uploader.destroy(publicId, {
    resource_type: resource_type,
  });
  return res;
};