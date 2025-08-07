import { NextFunction, Request, Response } from "express";
import { videogeneraterZodValidation } from "./schema";
import axios from "axios";
import { getShortVoiceName } from "../../utils/Voicemappping";
import { formatResponse } from "../../utils/formateResponse";

export const videoGeneraterService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body)
    const { title, style, voiceGender, voiceLanguage, seconds, language} = videogeneraterZodValidation.parse(req.body);

    const forShortName = `${voiceLanguage}${voiceGender}`;

    const shortName = getShortVoiceName(forShortName);
    console.log("Short Name:", shortName, "forShortName:", forShortName);

    if (!shortName) {
      return formatResponse(res, 400, "Invalid voice name", false, null);
    }


    const genapi = await axios.post(`${process.env.AI_URI}/video-gen-pro`, {
      topic: title,
      theme: style,
      voice: shortName,
      language: language.toLowerCase(),
      seconds: seconds
    })

    return genapi.data;
  } catch (error) {
    return error
  }
}