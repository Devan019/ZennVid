import { Router } from "express";
import { videoGeneraterController } from "./video_generater/controller";
import { isAuthenticated } from "../middleware";
import { deleteVideo, getVideos } from "./videoapi/controller";
import { lipSync } from "./video_generater/service";
import { CreateNewApp, dashboardStats, GetAllApps, SendKeyToEmail } from "./openapi/controller";
import { GenAudio, GenCaptions, GetVoices, Languages, Translater } from "./openapi/api/controller";
import { checkApiKey } from "./openapi/api/checkApiKey";
import { updateCredit } from "./pricing/controller";
// import { getVideos } from "./getVideo/controller";
// ===
export const ApiRouter = Router();

/** api  */

/**credits */
ApiRouter.post("/update-credit", isAuthenticated, updateCredit);

/**videoapi */
/** prompt to video gen */
ApiRouter.post("/generate-video",isAuthenticated ,videoGeneraterController);
ApiRouter.get("/videos", isAuthenticated, getVideos);
/** sadtalker */
ApiRouter.post("/sadtalker", isAuthenticated, lipSync);
/** delete */
ApiRouter.delete("/videos", isAuthenticated, deleteVideo);

/**openapi */
ApiRouter.get("/openapi/apps" , isAuthenticated , GetAllApps);
ApiRouter.post("/openapi/app" , isAuthenticated , CreateNewApp);
ApiRouter.post("/openapi/app/sendkey" , isAuthenticated , SendKeyToEmail);
ApiRouter.get("/openapi/dashboard", isAuthenticated, dashboardStats);

ApiRouter.get("/openapi/languages",checkApiKey, Languages); 
ApiRouter.get("/openapi/voices",checkApiKey, GetVoices); 
ApiRouter.post("/openapi/translate",checkApiKey, Translater);
ApiRouter.post("/openapi/generate-audio",checkApiKey, GenAudio);
ApiRouter.post("/openapi/generate-captions",checkApiKey, GenCaptions);
