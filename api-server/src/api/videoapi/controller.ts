import { Request, Response } from "express";
import expressAsyncHandler from "../../utils/expressAsync";
import { formatResponse } from "../../utils/formateResponse";

import VideoGenerater from "../video_generater/models/VideoSave";
import { getJobVideos } from "../video_generater/service";
import { generateSignedUrl } from "../../utils/s3";
import { S3_PRIVATE_BUCKET } from "../../env_var";
// import { deleteFileFromS3 } from "../../utils/s3";
// import redisClient from "../../utils/redisClient";

export const getVideos = expressAsyncHandler(async (req: Request, res: Response) => {
  try {

    const id = req.user.id;
    if (!id) {
      return formatResponse(res, 400, "User Not found", false, null);
    }

    // const rclient = await redisClient.get(`zennvid:videos:${id}`);
    // if(rclient){
    //   return formatResponse(res, 200, "Videos fetched successfully", true,JSON.parse(rclient));
    // }
    const videos = await VideoGenerater.find({ user: req.user.id });

    //update url with signed url
    const updatedVideos = await Promise.all(
      videos.map(async (video) => {
        const data = video.toObject();

        data.videoMetadata.url = data.videoMetadata.key
          ? await generateSignedUrl(
            data.videoMetadata.key,
            S3_PRIVATE_BUCKET!
          )
          : data.videoMetadata.url;

        return data;
      })
    );
    //get progress' videos
    const progressVideos = await getJobVideos(id);
    // await redisClient.set(`zennvid:videos:${id}`, JSON.stringify(videos), 'EX', 60*60);

    return formatResponse(res, 200, "Videos fetched successfully", true, {
      videos: updatedVideos,
      progressVideos
    });
  } catch (error) {
    return formatResponse(res, 500, "Internal Server Error", false, { error });
  }
})

export const deleteVideo = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const { videoId } = req.params;
    if (!id) {
      return formatResponse(res, 400, "User Not found", false, null);
    }

    await VideoGenerater.findOneAndDelete({ _id: videoId, user: id });
    // await redisClient.del(`zennvid:videos:${id}`)
    return formatResponse(res, 200, "Videos deleted successfully", true);
  } catch (error) {
    return formatResponse(res, 500, "Internal Server Error", false, { error });
  }
})