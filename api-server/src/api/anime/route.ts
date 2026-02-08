import express, { Router } from "express";
import multer from "multer";
import path from "path";
import { animeMatching } from "./controller";

const AnimeRouter = Router();

// Storage config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

AnimeRouter.post("/anime-matching", upload.single("image"), animeMatching);

export default AnimeRouter;
