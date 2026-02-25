import { Router } from "express";
import { syncStudio, magicVideo } from "./video_generater/controller";
import { isAuthenticated } from "../middleware";
import { deleteVideo, getVideos } from "./videoapi/controller";
import { CreateNewApp, dashboardStats, GetAllApps, SendKeyToEmail } from "./openapi/controller";
import { GenAudio, GenCaptions, GetVoices, Languages, Translater } from "./openapi/api/controller";
import { checkApiKey } from "./openapi/api/checkApiKey";
import { updateCredit } from "./pricing/controller";
import AdminUserRouter from "./Admin/user/route";
import StatsRouter from "./Admin/analisys/router";
import { scriptRouter } from "../script/route";
import FeedRouter from "./feed/route";
import multer from "multer";
import path from "path";
import { animeMatching } from "./anime/controller";

// import { getVideos } from "./getVideo/controller";
// ===
export const ApiRouter = Router();

// Storage config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


/** script */
ApiRouter.use("/script", scriptRouter);

/** api  */

/**admin */
ApiRouter.use("/admin/stats",isAuthenticated, StatsRouter);
ApiRouter.use("/admin",isAuthenticated, AdminUserRouter);

/** feed */
ApiRouter.use("/feed", FeedRouter);

/** anime matching */
ApiRouter.use("/anime", upload.single("image"),isAuthenticated, animeMatching);
/**credits */
ApiRouter.post("/update-credit", isAuthenticated, updateCredit);

/**videoapi */
/** prompt to video gen */
ApiRouter.post("/magic-video",isAuthenticated ,magicVideo);
ApiRouter.get("/videos", isAuthenticated, getVideos);
/** sadtalker */
ApiRouter.post("/syncstudio-video",upload.fields([{name: "image", maxCount: 1}, {name: "audio", maxCount: 1}]), isAuthenticated, syncStudio);
/** delete */
ApiRouter.delete("/videos/:videoId", isAuthenticated, deleteVideo);

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
