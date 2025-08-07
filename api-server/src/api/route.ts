import { Router } from "express";
import { videoGeneraterController } from "./video_generater/controller";

export const ApiRouter = Router();

/** api  */

/** prompt to video gen */

ApiRouter.post("/generate-video", videoGeneraterController);