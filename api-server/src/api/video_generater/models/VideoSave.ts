import mongoose from "mongoose";

export enum VideoType {
  MAGIC_VIDEO = "magic_video",
  SYNC_STUDIO_VIDEO = "sync_studio_video"
}

const videoGeneraterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoMetadata:{
    publicId : {
      type: String,
    },
    resourceType:{
      type: String,
    },
    format:{
      type: String,
    }
  },
  type:{
    type: String,
    enum: Object.values(VideoType),
    required: true
  },
  title : {
    type: String,
  },
  style : {
    type: String,
  },
  language : {
    type: String,
  },
  voiceCharacter : {
    type: String,
  }
}, {timestamps : true})


const Video = mongoose.models.Video ?? mongoose.model('Video', videoGeneraterSchema);

export default Video;