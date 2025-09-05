import { Router } from "express";
import { videoGeneraterController } from "./video_generater/controller";
import { isAuthenticated } from "../middleware";
import { getVideos } from "./getVideo/controller";
import { lipSync } from "./video_generater/service";
import { CreateNewApp, GetAllApps, SendKeyToEmail } from "./openapi/controller";
// import { getVideos } from "./getVideo/controller";
// ===
export const ApiRouter = Router();

/** api  */

/** prompt to video gen */
ApiRouter.post("/generate-video",isAuthenticated ,videoGeneraterController);
ApiRouter.get("/get-videos", isAuthenticated, getVideos);

/** sadtalker */
ApiRouter.post("/sadtalker", isAuthenticated, lipSync);

/**openapi */
ApiRouter.get("/openapi/apps" , isAuthenticated , GetAllApps);
ApiRouter.post("/openapi/app" , isAuthenticated , CreateNewApp);
ApiRouter.post("/openapi/app/sendkey" , isAuthenticated , SendKeyToEmail);