import { NextFunction, Request, Response } from "express";
import { lipSyncZodValidation, videogeneraterZodValidation } from "./schema";
import axios from "axios";
import { getShortVoiceName } from "../../utils/Voicemappping";
import { formatResponse } from "../../utils/formateResponse";
import connectToMongo from "../../utils/mongoConnection";
import VideoGenerater, { VideoType } from "./models/VideoSave";
import { User } from "../../auth/model/User";
import { AI_URI, SADTALKER } from "../../env_var";

interface videoUrl {
  video: string
}

export const videoGeneraterService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectToMongo();
    const { title, style, voiceGender, voiceLanguage, seconds, language } = videogeneraterZodValidation.parse(req.body);

    const forShortName = `${voiceLanguage}${voiceGender}`;

    const shortName = getShortVoiceName(forShortName);

    if (!shortName) {
      return formatResponse(res, 400, "Invalid voice name", false, null);
    }


    const genapi = await axios.post(`${AI_URI}/video-gen-pro`, {
      topic: title,
      theme: style,
      voice: shortName,
      language: language.toLowerCase(),
      seconds: seconds
    })

    // const genapi = await axios.get(`${process.env.AI_URI}/video-gen-test`);

    const data: videoUrl = genapi.data;
    if (!data.video) {
      return "Backend problem"
    }

    const newVideo = new VideoGenerater({
      videoUrl: data.video,
      user: req.user.id,
      type: VideoType.MAGIC_VIDEO,
      title: title,
      style: style,
      language: language,
      voiceCharacter: shortName
    })


    // console.log("video", newVideo, " api ", data)

    await newVideo.save();

    // await User.findByIdAndUpdate(req.user.id, {
    //   $inc: {
    //     credits: -20
    //   }
    // })

    return {
      videoUrl: data.video,
    }
  } catch (error) {
    console.error("Error in videoGeneraterService:", error);
    return error
  }
}

export const lipSync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectToMongo();
    const { description, character, title, style, language } = lipSyncZodValidation.parse(req.body);

    const audiGen = await axios.post(`${AI_URI}/voice-clone-captions`,{
      text: description,
      audio: character,
    })

    const audioUrlResponse = audiGen.data;

    const videoGen = await axios.post(`${SADTALKER}/generate-video`,{
      driven_audio: audioUrlResponse.audio,
      source_image : character,
      captions: audioUrlResponse.captions
    });

    const videoData = videoGen.data;

    const newVideo = new VideoGenerater({
      videoUrl: videoData.video,
      user: req.user.id,
      type: VideoType.SADTALKER,
      title: title,
      style: style,
      language: language,
      voiceCharacter: character
    })

    await newVideo.save();

    return formatResponse(res, 200, "Video generated successfully", true, {
      videoUrl: videoData.video,
    });

  } catch (error) {
    return formatResponse(res, 500, "Internal Server Error", false, null);
  }

}