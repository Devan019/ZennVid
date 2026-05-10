import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "../../utils/expressAsync";
import { formatResponse } from "../../utils/formateResponse";
import { magicVideoCreationService, syncStudioCreationVideo } from "./service";
import fs from "fs";
import VideoGenerater from "./models/VideoSave";

export interface scriptModule {
  prompt: string,
  description: string
}

export interface ScriptGen {
  scenes: scriptModule[]
}


export const cleanupUploadedFiles = (files: any) => {
  if (!files) return;
  
  const filesArray = [];
  if (files.image && files.image[0]) filesArray.push(files.image[0].path);
  if (files.audio && files.audio[0]) filesArray.push(files.audio[0].path);

  filesArray.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      }
    }
  });
};


export const magicVideo = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  console.log('Received request for magic video');
  try {
    if (req.user.credits < 20) {
      return formatResponse(res, 400, "Not enough credits", false, null);
    }
    console.log('Calling magic video creation service');
    return await magicVideoCreationService(req, res, next);
  } catch (error) {
    console.log('Error occurred while generating magic video:', error);
    return formatResponse(res, 500, "Internal server error", false, error);
  }
});

export const  syncStudio = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user.credits < 20) {
      cleanupUploadedFiles(req.files);
      return formatResponse(res, 400, "Not enough credits", false, null);
    }
    return await syncStudioCreationVideo(req, res, next);
  }catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
});


export const videoSave = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const { videoUrl } = req.body;
    if (!videoUrl) {
      return formatResponse(res, 400, "Video URL is required", false, null);
    }
    const videoGenerater = new VideoGenerater({
      user: req.user.id,
      videoUrl
    });
    await videoGenerater.save(); // Clear previous scripts for the user
    return formatResponse(res, 200, "Video saved successfully", true, null);
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
});

