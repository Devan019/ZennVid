import { Request, Response } from "express";

import { renderMedia } from "@remotion/renderer";
import { bundle } from "@remotion/bundler";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";



export const renderVideo = async (req: Request, res: Response) => {
  const { audioUrl, images, captions, width, height, title } = req.body;

  // For testing, use lower resolution
  const renderWidth = 1280 ;
  const renderHeight = 720 ;

  try {
    const entry = path.resolve("./src/test/remotion/index.tsx");
    const bundleLocation = await bundle(entry, () => { }, {
      // Using standard options that are part of MandatoryLegacyBundleOptions

    });

    const durationInFrames = Math.ceil(
      captions[captions.length - 1].end / (1000 / 30)
    );

    const outputLocation = path.resolve(
      "videos",
      `output.mp4`
    );

    await renderMedia({
      composition: {
        id: "RemotionVideo",
        width: renderWidth,
        height: renderHeight,
        fps: 30,
        durationInFrames,
        props: {
          audioUrl,
          images,
          captions,
          width: renderWidth,
          height: renderHeight,
        },
        defaultCodec: "h264",
        defaultOutName: "output.mp4",
        defaultProps: {
          audioUrl: "",
          images: [],
          capations: [],
          width: renderWidth,
          height: renderHeight,
        },
        defaultPixelFormat: "yuv420p",
        defaultVideoImageFormat: "png"
      },
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation,
      inputProps: {
        audioUrl,
        images,
        captions,
        width: renderWidth,
        height: renderHeight,
      },
    });



    res.json({
      message: "Rendered & saved",
      downloadUrl: `http://localhost:5000/videos/${outputLocation}`,
      videoId: "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Rendering failed" });
  }
};
