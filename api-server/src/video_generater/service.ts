import { NextFunction, Request, Response } from "express";
import { videogeneraterZodValidation } from "./schema";
import axios from "axios";
import { getShortVoiceName } from "../utils/Voicemappping";
import { formatResponse } from "../utils/formateResponse";


export const videoGeneraterService = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { title,style,  videoLength, voiceGender, voiceLanguage, frameSize } = videogeneraterZodValidation.parse(req.body);

    const forShortName = `${voiceLanguage}${voiceGender}`;

    const shortName = getShortVoiceName(forShortName);

    if(!shortName){
      return formatResponse(res, 400, "Invalid voice name", false, null);
    }

    const genapi = await axios.post(`${process.env.AI_URI}/generate-video`, {
      title,
      videoLength,
      theme : style,
      voice : shortName,
      image_size : frameSize
    })

    return formatResponse(res, 200, "Video generated successfully", true, genapi.data);
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
}