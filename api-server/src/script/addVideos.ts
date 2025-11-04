import { NextFunction, Request, Response } from "express";
import VideoGenerater, { VideoType } from "../api/video_generater/models/VideoSave";
import { User } from "../auth/model/User";
import expressAsyncHandler from "../utils/expressAsync";
import { formatResponse } from "../utils/formateResponse";

export const createBulkVideos = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    
    if (users.length === 0) {
      return formatResponse(res, 404, "No users found. Please create users first.", false, null);
    }

    
    const existingVideos = await VideoGenerater.find({});
    
    if (existingVideos.length === 0) {
      return formatResponse(res, 404, "No existing videos found. Please create some videos first to use as templates.", false, null);
    }
    
    const videosToCreate = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    
    const daysDifference = Math.floor((today.getTime() - twoMonthsAgo.getTime()) / (1000 * 60 * 60 * 24));

    
    for (let day = 0; day <= daysDifference; day++) {
      const dateForDay = new Date(twoMonthsAgo);
      dateForDay.setDate(twoMonthsAgo.getDate() + day);

    
      const videosForThisDay = Math.floor(Math.random() * 16);

      for (let i = 0; i < videosForThisDay; i++) {
        
        const randomUser = users[Math.floor(Math.random() * users.length)];
        
      
        const templateVideo = existingVideos[Math.floor(Math.random() * existingVideos.length)];

        
        videosToCreate.push({
          user: randomUser._id,
          videoUrl: templateVideo.videoUrl,
          type: templateVideo.type,
          title: templateVideo.title,
          style: templateVideo.style,
          language: templateVideo.language,
          voiceCharacter: templateVideo.voiceCharacter,
          createdAt: dateForDay,
          updatedAt: dateForDay
        });
      }
    }

    const createdVideos = await VideoGenerater.insertMany(videosToCreate);

    
    const videosByType = {
      MAGIC_VIDEO: createdVideos.filter(v => v.type === VideoType.MAGIC_VIDEO).length,
      SADTALKER: createdVideos.filter(v => v.type === VideoType.SADTALKER).length
    };

    return formatResponse(
      res, 
      201, 
      `Successfully created ${createdVideos.length} videos using ${existingVideos.length} existing video templates`, 
      true, 
      { 
        totalVideos: createdVideos.length,
        videosByType,
        templatesUsed: existingVideos.length,
        daysSpanned: daysDifference + 1,
        dateRange: {
          from: twoMonthsAgo.toISOString().split('T')[0],
          to: today.toISOString().split('T')[0]
        }
      }
    );
  } catch (error) {
    console.error("Error creating bulk videos:", error);
    return formatResponse(res, 500, "Internal server error", false, error);
  }
});