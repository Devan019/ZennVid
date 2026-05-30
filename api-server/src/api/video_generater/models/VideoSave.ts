import mongoose from "mongoose";
import { deleteFileFromS3 } from "../../../utils/s3";
import { S3_PRIVATE_BUCKET, S3_PUBLIC_BUCKET } from "../../../env_var";

export enum VideoType {
  MAGIC_STUDIO_VIDEO = "magic_studio_video",
  SYNC_STUDIO_VIDEO = "sync_studio_video"
}

const videoGeneraterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoMetadata: {
    url: {
      type: String,
    },
    key: {
      type: String,
    }
  },
  type: {
    type: String,
    enum: Object.values(VideoType),
    required: true
  },
  title: {
    type: String,
  },
  style: {
    type: String,
  },
  voiceCharacter: {
    type: String,
  }
}, { timestamps: true })

//add post remove hook to delete video from s3
videoGeneraterSchema.post('findOneAndDelete', async function (doc) {
  if (doc.videoMetadata?.key) {
    console.log(`Deleting video from S3 with key: ${doc.videoMetadata.key}`);

    //delete from private bucket
    await deleteFileFromS3(doc.videoMetadata.key, S3_PRIVATE_BUCKET!).catch(err => console.log(`Failed to delete video ${doc.videoMetadata.key}:`, err));

    //delete from public bucket
    await deleteFileFromS3(doc.videoMetadata.key, S3_PUBLIC_BUCKET!).catch(err => console.log(`Failed to delete video ${doc.videoMetadata.key} from public bucket:`, err));
  }
})


const Video = mongoose.models.Video ?? mongoose.model('Video', videoGeneraterSchema);

export default Video;