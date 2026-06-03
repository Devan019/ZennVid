import { Router } from "express";
import { syncStudio, magicVideo } from "./video_generater/controller";
import { isAuthenticated } from "../middleware";
import { deleteVideo, getVideos } from "./videoapi/controller";
import { createOrder, updateCredit } from "./pricing/controller";
import { scriptRouter } from "../script/route";
import FeedRouter from "./feed/route";
import multer from "multer";
import path from "path";
import { checkSyncStudioRateLimit, checkMagicStudioRateLimit } from "../utils/rate-limiting";

export const ApiRouter = Router();

// Storage config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit


/** script */
ApiRouter.use("/script", scriptRouter);

/** api  */

/** feed */
ApiRouter.use("/feed", FeedRouter);

/**credits */
ApiRouter.post("/update-credit", isAuthenticated, updateCredit);
ApiRouter.post("/create-order", isAuthenticated, createOrder);

/**videoapi */
/** prompt to video gen */
ApiRouter.post("/magic-video",isAuthenticated, checkMagicStudioRateLimit ,magicVideo);
ApiRouter.get("/videos", isAuthenticated, getVideos);
/** sadtalker */
ApiRouter.post("/syncstudio-video", isAuthenticated,checkSyncStudioRateLimit, upload.fields([{name: "image", maxCount: 1}, {name: "audio", maxCount: 1}]), syncStudio);
/** delete */
ApiRouter.delete("/videos/:videoId", isAuthenticated, deleteVideo);
