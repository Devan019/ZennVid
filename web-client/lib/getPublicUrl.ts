export function getCloudinaryUrl(videoMetadata:any) {
  const cloudName = "dpnae0bod";

  return `https://res.cloudinary.com/${cloudName}/${videoMetadata.resourceType}/upload/${videoMetadata.publicId}.${videoMetadata.format}`;
}