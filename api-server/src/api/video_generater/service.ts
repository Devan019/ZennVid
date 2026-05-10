import { NextFunction, Request, Response } from "express";
import { lipSyncZodValidation, videogeneraterZodValidation } from "./schema";
import { getShortVoiceName } from "../../utils/Voicemappping";
import { formatResponse } from "../../utils/formateResponse";
import { uploadToCloudinary } from "../../utils/cloudinary";
import fs from "fs";
import { languageToCodeDataset } from "../../constants/provider";
import { videoQueue } from "../../utils/bullmq-queue";
import { active_job_data, active_job_time, active_job_zset, magicVideoJobName, syncStudioJobName } from "../../env_var";
import { redisClient } from "../../utils/redisClient";
import { cleanupUploadedFiles } from "./controller";


const inProgressVideoCache = async (userId: string, job: any) => {
  try {
    //add job with userId to redis - using sorted set with score as timestamp for easy retrieval of active jobs
    const timestamp = Date.now() + active_job_time;

    //1. create pipline
    const pipeline = redisClient.pipeline();

    const zsetKey = `${active_job_zset}_${userId}`;
    const dataKey = `${active_job_data}_${userId}`;

    //2. add jobid to sorted set with score as timestamp for active jobs
    pipeline.zadd(zsetKey, timestamp, job.id);

    //3. data add to hset
    pipeline.hset(dataKey, job.id.toString(), JSON.stringify({
      stage: "queued",
      progress: 0,
      status: "progress",
    }));

    //4. execute pipeline
    pipeline.expire(zsetKey, active_job_time);
    pipeline.expire(dataKey, active_job_time);
    await pipeline.exec();
    return true;
  } catch (error) {
    console.log("Error caching in progress video:", error);
    return false;
  }

}

export const magicVideoCreationService = async (req: Request, res: Response, next: NextFunction) => {
  console.log("inside the magic video gen")
  try {

    const { title, style, voiceGender, voiceLanguage, seconds, language } = videogeneraterZodValidation.parse(req.body);

    const forShortName = `${voiceLanguage}${voiceGender}`;

    const shortName = getShortVoiceName(forShortName);

    if (!shortName) {
      return formatResponse(res, 400, "Invalid voice name", false, null);
    }

    const code = languageToCodeDataset[language.toLowerCase() as keyof typeof languageToCodeDataset];

    if (!code) {
      return formatResponse(res, 400, "Invalid language", false, null);
    }

    const userId = req.user.id;

    const task = {
      title, code, style, seconds, language, voice: shortName, userId
    }

    //add task into queue
    const job = await videoQueue.add(magicVideoJobName, {
      ...task
    });

    if (!job) {
      return formatResponse(res, 500, "Failed to add job to queue", false, null);
    }

    console.log('Magic video generation job added to queue with ID:', job.id);

    //add job to redis with userId
    if (!job.id) {
      return formatResponse(res, 500, "Failed to create job", false, null);
    }
    const cacheResult = await inProgressVideoCache(userId, job);

    if (!cacheResult) {
      console.log('Failed to cache in progress video for job:', job.id);
    }

    return formatResponse(res, 200, "Video generation started", true, {
      jobId: job.id
    });

  } catch (error) {
    console.log('Error occurred while generating magic video:', error);
    return formatResponse(res, 500, "Internal Server Error", false, null);
  }
}

export const syncStudioCreationVideo = async (req: Request, res: Response, next: NextFunction) => {
  let imagePath: string = "";
  let audioPath: string = "";
  try {

    if (!req.files || !(req.files as any).image || !(req.files as any).audio) {
      cleanupUploadedFiles(req.files);
      return res.status(400).json({ error: "No image or audio uploaded" });
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


    //add to queue
    const job = await videoQueue.add(syncStudioJobName, {
      imageUrl: uploadResult.url,
      audioUrl: uploadAudioResult.url,
      text: description,
      userId: req.user.id,
      character, title, style, language
    });

    const cacheResult = await inProgressVideoCache(req.user.id, job);

    if (!cacheResult) {
      console.log('Failed to cache in progress video for job:', job.id);
    }

    return formatResponse(res, 200, "Video generation started", true, {
      jobId: job.id
    });

  } catch (error) {
    return formatResponse(res, 500, "Internal Server Error", false, null);
  } finally {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }
  }

}

export const getJobVideos = async (userId: string) => {
  try {

    //2. get active jobs for user from redis sorted set
    const zsetKey = `${active_job_zset}_${userId}`;
    const dataKey = `${active_job_data}_${userId}`;

    //3. get all jobs
    const activeJobs = await redisClient.zrange(zsetKey, 0, -1);

    if (activeJobs.length === 0) {
      return [];
    }

    //4. remove jobs which are expired based on timestamp    
    const now = Date.now();
    const expiredJobs = await redisClient.zrangebyscore(zsetKey, 0, now);

    //5. remove expired jobs from sorted set and hash
    if (expiredJobs.length > 0) {
      await Promise.all([
        redisClient.zrem(zsetKey, ...expiredJobs),
        redisClient.hdel(dataKey, ...expiredJobs)
      ])
    }

    //6. get jobs which's progress is complete and remove them from active jobs list and filter out the rest
    const jobData = await redisClient.hmget(dataKey, ...activeJobs);

    const completedJobs: string[] = [];
    const finalJobs: any[] = [];

    for (let i = 0; i < activeJobs.length; i++) {
      const jobId = activeJobs[i];
      const data = jobData[i];

      if (!data) {
        //means jobs are done
        completedJobs.push(jobId);
        continue;
      }

      const parsedData = JSON.parse(data);

      //check if job is completed or failed
      if (parsedData.status === "completed" || parsedData.status === "failed") {
        completedJobs.push(jobId);
      } else {
        finalJobs.push({...parsedData, jobId});
      }

    }

    //7. remove completed jobs from sorted set and hash
    if (completedJobs.length > 0) {
      await Promise.all([
        redisClient.zrem(zsetKey, ...completedJobs),
        redisClient.hdel(dataKey, ...completedJobs)
      ])
    }

    //8. return active jobs
    return finalJobs;
  } catch (error) {
    return error;
  }
}

// export const syncStudioCreationVideoTmp = async (req: Request, res: Response, next: NextFunction) => {
//   return formatResponse(res, 200, "Video generated successfully", true, {
//     url: 'https://res.cloudinary.com/dpnae0bod/video/upload/v1772186642/zennvid/m5vyj4zx3z301zy1zmws.mp4',
//     publicId: 'zennvid/m5vyj4zx3z301zy1zmws',
//     format: 'mp4',
//     resourceType: 'video'
//   }
//   );
// }