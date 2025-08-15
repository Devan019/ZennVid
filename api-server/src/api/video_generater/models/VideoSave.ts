import mongoose from "mongoose";

export enum VideoType {
  MAGIC_VIDEO = "magic_video",
  SADTALKER = "SadTalker"
}

const videoGeneraterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
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
})


const VideoGenerater = mongoose.model('VideoGenerater', videoGeneraterSchema);

export default VideoGenerater;