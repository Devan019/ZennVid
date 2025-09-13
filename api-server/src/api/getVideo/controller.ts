import { Request, Response } from "express";
import expressAsyncHandler from "../../utils/expressAsync";
import { formatResponse } from "../../utils/formateResponse";

import VideoGenerater from "../video_generater/models/VideoSave";

export const getVideos = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    ;
    const id = req.user.id;
    if (!id) {
      return formatResponse(res, 400, "User Not found", false, null);
    }
    const videos = await VideoGenerater.find({ user: req.user.id });
    return formatResponse(res, 200, "Videos fetched successfully", true, videos);
  } catch (error) {
    return formatResponse(res, 500, "Internal Server Error", false, {error});
  }
})