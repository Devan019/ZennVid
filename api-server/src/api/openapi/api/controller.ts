import { Request, Response } from "express";
import expressAsyncHandler from "../../../utils/expressAsync";
import connectToMongo from "../../../utils/mongoConnection";
import OpenApi from "../model";
import { formatResponse } from "../../../utils/formateResponse";
import { decrypt, sha256Hex } from "../../../utils/cyrpto";
import { AI_URI, OPENAPI_SECERT } from "../../../env_var";
import axios from "axios";
import { checkApiKey } from "./checkApiKey";

export const Translater = expressAsyncHandler(async (req: Request, res: Response) => {
  try {

    await connectToMongo();

    const {status, app} = await checkApiKey(req, res);
    if(!status){
      return formatResponse(res, 401, "Appname is invalid", false);
    }

    /** check it */
    const doTranslate = await axios.post(`${AI_URI}/translate`);

    /** todo increment api call of app */
    return formatResponse(res, 200, "Translation succesfully",true, {...doTranslate.data});
  } catch (error) {
    return formatResponse(res,500, "Internal server problem", false);
  }
})