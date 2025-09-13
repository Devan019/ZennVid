import { Request, Response } from "express";
import expressAsyncHandler from "../../../utils/expressAsync";
import OpenApi from "../model";
import { formatResponse } from "../../../utils/formateResponse";
import { OPENAPI_URL } from "../../../env_var";
import axios from "axios";
import { languages, voices } from "../../../constants/provider";
import { AudioGenSchema, CaptionGenSchema, TranslaterSchema } from "./schema";
import { User } from "../../../auth/model/User";

export const Translater = expressAsyncHandler(async (req: Request, res: Response) => {
  try {

    const user = req.user;
    if(user.credits < 10) {
      return formatResponse(res, 400, "Not enough credits", false);
    }

    const { text, language } = TranslaterSchema.parse(req.body);

    const doTranslate = await axios.post(`${OPENAPI_URL}/translate-text`, {
      text,
      language
    });

    await OpenApi.findOneAndUpdate({ "apps.appName": req.headers["x-app-name"] }, {
      $inc: { apiCalls: 1 }
    });

    await User.findByIdAndUpdate(req.user?.id, {
      $inc: { credits: -10 }
    })

    /** todo increment api call of app */
    return formatResponse(res, 200, "Translation succesfully", true, { ...doTranslate.data });
  } catch (error) {
    console.error("error found", error);
    return formatResponse(res, 500, "Internal server problem", false, {error});
  }
})

export const Languages = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    await OpenApi.findOneAndUpdate({ "apps.appName": req.headers["x-app-name"] }, {
      $inc: { apiCalls: 1 }
    });

    return formatResponse(res, 200, "Languages fetched succesfully", true, { Languages: languages });
  } catch (error) {
    console.error("error found", error);
    return formatResponse(res, 500, "Internal server problem", false, error);
  }
})

export const GenAudio = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if(user.credits < 10) {
      return formatResponse(res, 400, "Not enough credits", false);
    }
    const { voice, text } = AudioGenSchema.parse(req.body);
    await OpenApi.findOneAndUpdate({ "apps.appName": req.headers["x-app-name"] }, {
      $inc: { apiCalls: 1 }
    });

    await User.findByIdAndUpdate(req.user?.id, {
      $inc: { credits: -10 }
    })

    const api = await axios.post(`${OPENAPI_URL}/generate-audio`, { text, voice });
    return formatResponse(res, 200, "Audio generated succesfully", true, api.data);
  } catch (error) {
    return formatResponse(res, 500, "Internal server problem", false, error);
  }
})

export const GetVoices = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    
    await OpenApi.findOneAndUpdate({ "apps.appName": req.headers["x-app-name"] }, {
      $inc: { apiCalls: 1 }
    });
    return formatResponse(res, 200, "Voices fetched succesfully", true, voices);
  } catch (error) {
    return formatResponse(res, 500, "Internal server problem", false, error);
  }

})

export const GenCaptions = expressAsyncHandler(async (req: Request, res: Response) => {

  try {
    const user = req.user;
    if(user.credits < 10) {
      return formatResponse(res, 400, "Not enough credits", false);
    }
    const { audio, language } = CaptionGenSchema.parse(req.body);

    const api = await axios.post(`${OPENAPI_URL}/generate-captions`, { audio, language });
    await OpenApi.findOneAndUpdate({ "apps.appName": req.headers["x-app-name"] }, {
      $inc: { apiCalls: 1 }
    });
    await User.findByIdAndUpdate(req.user?.id, {
      $inc: { credits: -10 }
    });
    return formatResponse(res, 200, "Captions generated succesfully", true, api.data);
  } catch (error) {
    return formatResponse(res, 500, "Internal server problem", false, error);
  }

});