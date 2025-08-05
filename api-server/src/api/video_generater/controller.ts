import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "../../utils/expressAsync";
import { formatResponse } from "../../utils/formateResponse";
import { videoGeneraterService } from "./service";
import connectToMongo from "../../utils/mongoConnection";
import { scriptGenZodValidation } from "./schema";
import axios from "axios";
import { AI_URI } from "../../env_var";

interface scriptModule {
  prompt: string,
  description: string
}

interface script {
  scenes : scriptModule[]
}

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

export const scriptGenerater = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const { maxChars, title, style } = scriptGenZodValidation.parse(body);
    const api = await axios.post(`${AI_URI}/script-gen`, { title, style, maxChars })
    const data: script = api.data
    let desc: string = "";

    data?.scenes.forEach((value) => {
      desc += value.description
    })
    return formatResponse(res, 200, "video script is ready!!!", true, desc)
  } catch (error) {
    console.log(error)
    return formatResponse(res, 500, "Internal server error", false, error);
  }
})