//get all video and upload to s3 and update videoMetadata with s3 url and key

import axios from "axios";
import Video from "../api/video_generater/models/VideoSave";
import { generateSignedUrl, getS3PublicUrl, moveKeyToPrivateS3, uploadBufferToS3, uploadUrlToS3 } from "../utils/s3";
import { S3_CDN, S3_PRIVATE_BUCKET, video_prefix } from "../env_var";
import { getCloudinaryUrl } from "../utils/cloudinary";
import connectToMongo from "../utils/mongoConnection";
import Feed from "../api/feed/model";

// export const migrations_S3 = async () => {
//   try {
//     console.log("Starting S3 migration...");

//     //1. get all videos from mongoose
//     const videos = await Video.find({});
//     console.log(`Found ${videos.length} videos to migrate to S3`);

//     //2. loop through videos and upload to s3 and update videoMetadata with s3 url and key
//     for (const video of videos) {
//       console.log({
//         videoMetadata: video.videoMetadata,
//         publicId: video.videoMetadata?.publicId,
//         resourceType: video.videoMetadata?.resourceType,
//         format: video.videoMetadata?.format,
//       });
//       if (!video.videoMetadata || !video.videoMetadata.publicId || !video.videoMetadata.resourceType || !video.videoMetadata.format) {
//         console.log(`Skipping video ${video._id} due to missing videoMetadata or publicId or resourceType or format`);
//         break;
//       }

//       //url
//       const url = getCloudinaryUrl(video.videoMetadata.publicId, video.videoMetadata.resourceType, video.videoMetadata.format);

//       //get file as stream from videoMetadata.url
//       const stream = await axios.get(url, { responseType: 'stream' });

//       //upload to s3 and get url and key
//       const data = await uploadBufferToS3({
//         buffer: stream.data,
//         prefix: video_prefix,
//         contentType: 'video/mp4'
//       });
//       if (!data) {
//         console.log(`Failed to upload video ${video._id} to S3`);
//         continue;
//       }

//       if (!data.Key || !data.Location) {
//         console.log(`Invalid data returned from S3 upload for video ${video._id}`);
//         continue;
//       }

//       //update videoMetadata with s3 url and key
//       video.videoMetadata.url = data.Location;
//       video.videoMetadata.key = data.Key;
//       console.log(`Successfully uploaded video ${video._id} to S3`);
//       await video.save();
//     }
//     //3. log success message
//     console.log("S3 migration completed successfully");

//   } catch (error) {
//     console.error("Error during S3 migration:", error);
//   }
// }

// export const s3toR2 = async () => {
//   try {
//     console.log("Starting S3 to R2 migration...");
//     await connectToMongo();

//     //1. get all videos from mongoose
//     const videos = await Video.find({});
//     console.log(`Found ${videos.length} videos to migrate from S3 to R2`);

//     //2. loop through videos and upload to r2 and update videoMetadata with r2 url and key
//     for (const video of videos) {
//       if (!video.videoMetadata || !video.videoMetadata.key || !video.videoMetadata.url) {
//         console.log(`Skipping video ${video._id} due to missing videoMetadata or key or url`);
//         continue;
//       }
//       //if video url already contains r2 endpoint, skip
//       if (video.videoMetadata.url.includes("pub")) {
//         console.log(`Skipping video ${video._id} as it already contains R2 URL`);
//         continue;
//       }

//       //get file as stream from videoMetadata.url
//       const stream = await axios.get(video.videoMetadata.url, { responseType: 'stream' });
//       //upload to r2 and get url and key
//       const data = await uploadBufferToS3({
//         buffer: stream.data,
//         prefix: video_prefix,
//         contentType: 'video/mp4'
//       });
//       if (!data) {
//         console.log(`Failed to upload video ${video._id} to S3`);
//         continue;
//       }

//       if (!data.Key || !data.Location) {
//         console.log(`Invalid data returned from S3 upload for video ${video._id}`);
//         continue;
//       }

//       //update videoMetadata with s3 url and key
//       video.videoMetadata.url = data.Location;
//       video.videoMetadata.key = data.Key;
//       console.log(`Successfully uploaded video ${video._id} to S3`);
//       await video.save();

//     }

//     //3. log success message
//     console.log("R2 migration completed successfully");

//   } catch (error) {
//     console.error("Error during S3 to R2 migration:", error);
//   }
// }

const changeUrl = async () => {
  try {
    console.log("Starting URL change...");
    await connectToMongo();

    //1. get all videos from mongoose
    const videos = await Video.find({});
    console.log(`Found ${videos.length} videos to change URL`);

    //2. loop through videos and change url to cdn url
    for (const video of videos) {
      if (!video.videoMetadata || !video.videoMetadata.url || !video.videoMetadata.key) {
        console.log(`Skipping video ${video._id} due to missing videoMetadata or url`);
        continue;
      }

      const url = video.videoMetadata.url;
      if (!url.includes("pub")) {
        console.log(`Skipping video ${video._id} as it does not contain R2 URL`);
        continue;
      }

      const newUrl = `${S3_CDN}/${video.videoMetadata.key}`;
      video.videoMetadata.url = newUrl;
      console.log(`Successfully changed URL for video ${video._id}`);
      await video.save();
    }
    console.log("URL change completed successfully");

  } catch (error) {
    console.error("Error during URL change:", error);
  }
}

const setPublicUrl = async () => {
  try {
    console.log("Starting setting public URL...");
    await connectToMongo();

    //1. get all videos from mongoose
    const videos = await Video.find({});
    console.log(`Found ${videos.length} videos to set public URL`);

    //2, get feed
    const feed = await Feed.find({}).populate("video");

    //3. map of video id and feed id
    const videoFeedMap = new Map();

    feed.forEach((f) => {
      if (f.video) {
        videoFeedMap.set(f.video._id.toString(), f._id.toString());
      } else {
        console.log(`Feed ${f._id} does not have a video`);
      }
    });

    //4. loop through videos and set public url
    for (const video of videos) {
      if (!video.videoMetadata || !video.videoMetadata.key) {
        console.log(`Skipping video ${video._id} due to missing videoMetadata or url`);
        continue;
      }

      const feedId = videoFeedMap.get(video._id.toString());
      if (!feedId) {
        console.log(`No feed found for video ${video._id}`);
        video.videoMetadata.url = "";
        await video.save();
        continue;
      }

      const newUrl = getS3PublicUrl(video.videoMetadata.key);

      //update video
      video.videoMetadata.url = newUrl;
      console.log(`Successfully set public URL for video ${video._id}`);
      await video.save();
    }
    console.log("Setting public URL completed successfully");
  } catch (error) {
    console.error("Error during setting public URL:", error);
  }
}

const uploadToPrivateBucket = async () => {
  try {
    console.log("Starting upload to private bucket...");
    await connectToMongo();

    //1. get all videos from mongoose
    const videos = await Video.find({});
    console.log(`Found ${videos.length} videos to upload to private bucket`);

    //2. loop through videos and upload to private bucket
    for (const video of videos) {
      if (!video.videoMetadata || !video.videoMetadata.key) {
        console.log(`Skipping video ${video._id} due to missing videoMetadata or key`);
        continue;
      }

      //move to private s3 and get new url and key
      const data = await moveKeyToPrivateS3({
        key: video.videoMetadata.key,
        contentType: 'video/mp4'
      });

      if (!data) {
        console.log(`Failed to move video ${video._id} to private S3`);
        continue;
      }

      console.log(`Successfully moved video ${video._id} to private S3 with new key ${data.Key} and url ${data.Location}`);
    }
    console.log("Upload to private bucket completed successfully");
  } catch (error) {
    console.error("Error during upload to private bucket:", error);
  }
}
