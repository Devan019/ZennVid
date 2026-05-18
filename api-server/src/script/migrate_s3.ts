//get all video and upload to s3 and update videoMetadata with s3 url and key

import axios from "axios";
import Video from "../api/video_generater/models/VideoSave";
import { uploadBufferToS3 } from "../utils/s3";
import { video_prefix } from "../env_var";
import { getCloudinaryUrl } from "../utils/cloudinary";

export const migrations_S3 = async () => {
  try {
    console.log("Starting S3 migration...");

    //1. get all videos from mongoose
    const videos = await Video.find({});
    console.log(`Found ${videos.length} videos to migrate to S3`);

    //2. loop through videos and upload to s3 and update videoMetadata with s3 url and key
    for (const video of videos) {
      console.log({
        videoMetadata: video.videoMetadata,
        publicId: video.videoMetadata?.publicId,
        resourceType: video.videoMetadata?.resourceType,
        format: video.videoMetadata?.format,
      });
      if (!video.videoMetadata || !video.videoMetadata.publicId || !video.videoMetadata.resourceType || !video.videoMetadata.format) {
        console.log(`Skipping video ${video._id} due to missing videoMetadata or publicId or resourceType or format`);
        break;
      }

      //url
      const url = getCloudinaryUrl(video.videoMetadata.publicId, video.videoMetadata.resourceType, video.videoMetadata.format);

      //get file as stream from videoMetadata.url
      const stream = await axios.get(url, { responseType: 'stream' });

      //upload to s3 and get url and key
      const data = await uploadBufferToS3({
        buffer: stream.data,
        prefix: video_prefix,
        contentType: 'video/mp4'
      });
      if (!data) {
        console.log(`Failed to upload video ${video._id} to S3`);
        continue;
      }

      if (!data.Key || !data.Location) {
        console.log(`Invalid data returned from S3 upload for video ${video._id}`);
        continue;
      }

      //update videoMetadata with s3 url and key
      video.videoMetadata.url = data.Location;
      video.videoMetadata.key = data.Key;
      console.log(`Successfully uploaded video ${video._id} to S3`);
      await video.save();
    }
    //3. log success message
    console.log("S3 migration completed successfully");

  } catch (error) {
    console.error("Error during S3 migration:", error);
  }
}