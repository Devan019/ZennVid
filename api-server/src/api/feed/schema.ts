import z from "zod";

const feedCreateSchema = z.object({
  userId : z.string().min(1, "User ID is required"),
  videoId : z.string().min(1, "Video ID is required"),
})

const LikeSchema = z.object({
  feedId : z.string().min(1, "Feed ID is required"),
  userId : z.string().min(1, "User ID is required"),
})

const CommentSchema = z.object({
  feedId : z.string().min(1, "Feed ID is required"),
  userId : z.string().min(1, "User ID is required"),
  content : z.string().min(1, "Content is required"),
})

export { feedCreateSchema, LikeSchema, CommentSchema }