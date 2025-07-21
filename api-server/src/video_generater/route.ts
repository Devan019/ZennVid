import { Router } from "express";
import { videoGeneraterController } from "./controller";

export const videoRouter = Router();

/** prompt to video gen */

videoRouter.post("/generate-video", videoGeneraterController);

/** video save */


