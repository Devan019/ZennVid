import { Router } from "express";
import { videoGeneraterController } from "./video_generater/controller";
import { isAuthenticated } from "../middleware";

export const ApiRouter = Router();

/** api  */

/** prompt to video gen */
ApiRouter.post("/generate-video",isAuthenticated ,videoGeneraterController);
ApiRouter.get("/get-videos", isAuthenticated, videoGeneraterController);