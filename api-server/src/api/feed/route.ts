import { Router } from "express";
import { feedCreate, getFeed, feedDelete, feedLikeCountUpdate, feedComment, feedCommentDelete } from "./controller";


const FeedRouter = Router();

FeedRouter.post("/", feedCreate);
FeedRouter.get("/", getFeed);
FeedRouter.delete("/:feedId", feedDelete);
FeedRouter.put("/:feedId/like", feedLikeCountUpdate);
FeedRouter.post("/:feedId/comment", feedComment);
FeedRouter.delete("/:feedId/comment/:commentId", feedCommentDelete);

export default FeedRouter;