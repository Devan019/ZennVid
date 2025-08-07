import mongoose from "mongoose";

const videoGeneraterSchema = new mongoose.Schema({
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoUrl : {
    type: String,
    required: true
  }
})


const VideoGenerater = mongoose.model('VideoGenerater', videoGeneraterSchema);

export default VideoGenerater;