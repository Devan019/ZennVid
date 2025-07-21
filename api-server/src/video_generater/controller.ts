import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "../utils/expressAsync";
import { formatResponse } from "../utils/formateResponse";
import { videoGeneraterService } from "./service";
import connectToMongo from "../utils/mongoConnection";


export const videoGeneraterController = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await videoGeneraterService(req, res, next);
    return formatResponse(res, 200, "Video generated successfully", true, response);
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
});

export const videoSave = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectToMongo();
    const { videoUrl } = req.body;
    if (!videoUrl) {
      return formatResponse(res, 400, "Video URL is required", false, null);
    }

    
    return formatResponse(res, 200, "Video saved successfully", true, null);
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
});

