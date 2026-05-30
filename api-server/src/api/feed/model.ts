import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {timestamps: true});

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, {timestamps: true});

const FeedSchema = new Schema({
  video : {
    type: Schema.Types.ObjectId,
    ref: "Video",
    required: true
  },
  user : {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  likes: [
    LikeSchema
  ],
  comments: [
    CommentSchema
  ]
},  {timestamps: true});

const Feed = mongoose.models.Feed || mongoose.model('Feed', FeedSchema);

export default Feed;