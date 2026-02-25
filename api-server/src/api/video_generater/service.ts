import { NextFunction, Request, Response } from "express";
import { lipSyncZodValidation, videogeneraterZodValidation } from "./schema";
import { getShortVoiceName } from "../../utils/Voicemappping";
import { formatResponse } from "../../utils/formateResponse";

import Video, { VideoType } from "./models/VideoSave";
import { User } from "../../auth/model/User";
import redisClient from "../../utils/redisClient";
import { deleteFromCloudinary, getCloudinaryUrl, uploadToCloudinary } from "../../utils/cloudinary";
import { createMagicVideo, syncStudioVideo } from "../../AI Layer/service";
import fs from "fs";
interface videoData {
  format: string;
  resource_type: string;
  publicId: string;
  url: string;
}

export const magicVideoCreationService = async (req: Request, res: Response, next: NextFunction) => {

  try {

    const { title, style, voiceGender, voiceLanguage, seconds, language } = videogeneraterZodValidation.parse(req.body);

    const forShortName = `${voiceLanguage}${voiceGender}`;

    const shortName = getShortVoiceName(forShortName);

    if (!shortName) {
      return formatResponse(res, 400, "Invalid voice name", false, null);
    }

    //genrate video
    const data = await createMagicVideo({
      title,
      style,
      seconds,
      language,
      voice: shortName
    });

    if (!data) {
      return formatResponse(res, 500, "Video generation failed", false, null);
    }

    // const genapi = await axios.get(`${process.env.AI_URI}/video-gen-test`);
    if (!data?.publicId || !data?.resourceType || !data?.format) {
      return formatResponse(res, 500, "Backend problem", false, null);
    }

    const newVideo = new Video({
      videoMetadata: {
        publicId: data.publicId,
        resourceType: data.resourceType,
        format: data.format,
      },
      user: req.user.id,
      type: VideoType.MAGIC_VIDEO,
      title: title,
      style: style,
      language: language,
      voiceCharacter: shortName
    })


    // console.log("video", newVideo, " api ", data)

    await newVideo.save();

    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        credits: -20
      }
    })
    req.user.credits -= 20;

    await redisClient.del(`zennvid:videos:${req.user.id}`)

    return formatResponse(res, 200, "Video generated successfully", true, {
      videoUrl: getCloudinaryUrl(data.publicId, data.resourceType, data.format)
    });
  } catch (error) {
    return error
  }
}

export const syncStudioCreationVideo = async (req: Request, res: Response, next: NextFunction) => {
  let imagePath: string = "";
  let audioPath: string = "";
  try {
    if (req.user.credits < 20) {
      console.log("Not enough credits");
      return formatResponse(res, 400, "Not enough credits", false, null);
    }

    if (!req.files) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    imagePath = (req.files as any).image[0].path;
    audioPath = (req.files as any).audio[0].path;

    //upload image to cloudinary
    const uploadResult = await uploadToCloudinary({
      filePath: imagePath,
      folder: "zennvid/sync-studio",
      resource_type: "image"
    });

    //upload audio to cloudinary
    const uploadAudioResult = await uploadToCloudinary({
      filePath: audioPath,
      folder: "zennvid/sync-studio",
      resource_type: "raw"
    })

    if (!uploadResult || !uploadResult.publicId || !uploadResult.url) {
      return formatResponse(res, 500, "Image upload failed", false, null);
    }
    
    if (!uploadAudioResult || !uploadAudioResult.publicId || !uploadAudioResult.url) {
      return formatResponse(res, 500, "Audio upload failed", false, null);
    }

    const { description, character, title, style, language } = lipSyncZodValidation.parse(req.body);

    const videoData = await syncStudioVideo({
      imagePath: uploadResult.url,
      text: description,
      audioPath: uploadAudioResult.url
    });

    if(videoData == null){
      return formatResponse(res, 500, "Video generation failed", false, null);
    }

    //delete uploaded image and audio from cloudinary
    //image
    await deleteFromCloudinary({
      publicId: uploadResult.publicId,
      resource_type: "image"
    })

    //audio
    await deleteFromCloudinary({
      publicId: uploadAudioResult.publicId,
      resource_type: "raw"
    })

    const newVideo = new Video({
      videoMetadata: {
        publicId: videoData.publicId,
        resourceType: videoData.resourceType,
        format: videoData.format
      },
      user: req.user.id,
      type: VideoType.SYNC_STUDIO_VIDEO,
      title: title,
      style: style,
      language: language,
      voiceCharacter: character
    })

    await newVideo.save();

    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        credits: -20
      }
    });

    req.user.credits -= 20;

    await redisClient.del(`zennvid:videos:${req.user.id}`)

    return formatResponse(res, 200, "Video generated successfully", true, {
      videoUrl: getCloudinaryUrl(videoData.publicId, videoData.resourceType, videoData.format),
    });

    // return  formatResponse(res, 200, "Video generated successfully", true, null);

  } catch (error) {
    return formatResponse(res, 500, "Internal Server Error", false, null);
  }finally{
    if(fs.existsSync(imagePath)){
      fs.unlinkSync(imagePath);
    }
    if(fs.existsSync(audioPath)){
      fs.unlinkSync(audioPath);
    }
  }

}