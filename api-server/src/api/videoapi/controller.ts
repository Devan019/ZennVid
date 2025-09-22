import { Request, Response } from "express";
import expressAsyncHandler from "../../utils/expressAsync";
import { formatResponse } from "../../utils/formateResponse";

import VideoGenerater from "../video_generater/models/VideoSave";
import redisClient from "../../utils/redisClient";

export const getVideos = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    
    const id = req.user.id;
    if (!id) {
      return formatResponse(res, 400, "User Not found", false, null);
    }

    const rclient = await redisClient.get(`zennvid:videos:${id}`);
    if(rclient){
      return formatResponse(res, 200, "Videos fetched successfully", true,JSON.parse(rclient));
    }
    const videos = await VideoGenerater.find({ user: req.user.id });
    await redisClient.set(`zennvid:videos:${id}`, JSON.stringify(videos), 'EX', 60*60);
    return formatResponse(res, 200, "Videos fetched successfully", true, videos);
  } catch (error) {
    return formatResponse(res, 500, "Internal Server Error", false, {error});
  }
})

export const deleteVideo = expressAsyncHandler(async(req: Request, res:Response) => {
  try {
    const id = req.user.id;
    const {videoId} = req.query;
    if (!id) {
      return formatResponse(res, 400, "User Not found", false, null);
    }

    await VideoGenerater.findByIdAndDelete({videoId})
    await redisClient.del(`zennvid:videos:${id}`)
    return formatResponse(res, 200, "Videos deleted successfully", true);
  } catch (error) {
    return formatResponse(res, 500, "Internal Server Error", false, {error});
  }
})