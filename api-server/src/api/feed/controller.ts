import { Request, Response } from "express";
import expressAsyncHandler from "../../utils/expressAsync";
import { CommentSchema, feedCreateSchema, LikeSchema } from "./schema";
import { createFeedService, deletedFeedService, feedCommentDeleteService, feedCommentService, getFeedsService, LikeCountUpdateService } from "./service";
import { ISendResponse } from "../../constants/interfaces";
import { formatResponse } from "../../utils/formateResponse";

const feedCreate = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId, videoId } = feedCreateSchema.parse(req.body);
    const response:ISendResponse = await createFeedService({ userId, videoId });
    return formatResponse(res, response.status, response.message, response.success, response.data);
  } catch (error) {
    return formatResponse(res, 500, "Internal Server Error", false, null);
  }
});

const feedDelete = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const { feedId } = req.params;
    const response:ISendResponse = await deletedFeedService({ feedId : feedId as string });
    return formatResponse(res, response.status, response.message, response.success, response.data);
  }
  catch (error) {
    return formatResponse(res, 500, "Internal Server Error", false, null);
  }
});

const getFeed = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const response:ISendResponse = await getFeedsService();
    return formatResponse(res, response.status, response.message, response.success, response.data);
  } catch (error) {
    console.log(error);
    return formatResponse(res, 500, "Internal Server Error", false, null);
  }
});

const feedLikeCountUpdate = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const { feedId } = req.params;
    if(!feedId){
      return formatResponse(res, 400, "Feed ID is required", false, null);
    }
    const { userId } = LikeSchema.parse(req.body);
    console.log("feedId:", feedId, "userId:", userId);
    const response:ISendResponse = await LikeCountUpdateService({ feedId: feedId as string, userId });
    return formatResponse(res, response.status, response.message, response.success, response.data); 
  } catch (error) {
    return formatResponse(res, 500, "Internal Server Error", false, null);
  }
});

const feedComment = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId, content } = CommentSchema.parse(req.body);
    const { feedId } = req.params;
    if(!feedId){
      return formatResponse(res, 400, "Feed ID is required", false, null);
    }
    const response:ISendResponse = await feedCommentService({ feedId: feedId as string, userId, content });
    return formatResponse(res, response.status, response.message, response.success, response.data);
  } catch (error) {
    return formatResponse(res, 500, "Internal Server Error", false, null);
  }
});

const feedCommentDelete = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const response:ISendResponse = await feedCommentDeleteService({ commentId: commentId as string });
    return formatResponse(res, response.status, response.message, response.success, response.data);
  } catch (error) {
    return formatResponse(res, 500, "Internal Server Error", false, null);
  }
});

export { feedCreate, getFeed, feedDelete, feedLikeCountUpdate, feedComment, feedCommentDelete };