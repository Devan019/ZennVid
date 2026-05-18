import mongoose from "mongoose";
import { deleteFileFromS3 } from "../../../utils/s3";

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
    await deleteFileFromS3(doc.videoMetadata.key);
  }
})


const Video = mongoose.models.Video ?? mongoose.model('Video', videoGeneraterSchema);

export default Video;