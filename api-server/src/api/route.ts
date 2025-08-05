import { Router } from "express";
import { scriptGenerater, videoGeneraterController } from "./video_generater/controller";

export const ApiRouter = Router();

/** api  */
/** generate script */
ApiRouter.post("/generate-script", scriptGenerater);

/** prompt to video gen */

ApiRouter.post("/generate-video", videoGeneraterController);