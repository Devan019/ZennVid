import { Router } from "express";
import { feedCreate, getFeed, feedDelete, feedLikeCountUpdate, feedComment, feedCommentDelete } from "./controller";
import { isAuthenticated } from "../../middleware";


const FeedRouter = Router();

FeedRouter.post("/",isAuthenticated, feedCreate);
FeedRouter.get("/", getFeed);
FeedRouter.delete("/:feedId", isAuthenticated, feedDelete);
FeedRouter.put("/:feedId/like", isAuthenticated, feedLikeCountUpdate);
FeedRouter.post("/:feedId/comment", isAuthenticated, feedComment);
FeedRouter.delete("/:feedId/comment/:commentId", isAuthenticated, feedCommentDelete);

export default FeedRouter;