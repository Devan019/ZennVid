import { Job } from "bullmq";
import { User } from "../../auth/model/User";
import { syncStudioVideo } from "../../AI Layer/service";
import Video, { VideoType } from "../../api/video_generater/models/VideoSave";
import { deleteFileFromS3 } from "../../utils/s3";
import { S3_PRIVATE_BUCKET } from "../../env_var";

const syncStudioTask = async (job: Job) => {
  try {
    const {
      imageData,
      audioData,
      text,
      userId,
      character, title, style, isVoiceCloning
    } = job.data;

    if (!imageData || !audioData || !text || !userId || !character || !title || !style || !userId) {
      console.log('Missing required data for sync studio video generation in job:', job.id);
      return {
        stage: "video_generated",
        percent: 100,
        status: "failed",
        userId,
        error: 'Missing required data for sync studio video generation'
      }
    }

    //check userid exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found for sync studio video generation in job:', job.id, 'with userId:', userId);
      return {
        stage: "video_generated",
        percent: 100,
        status: "failed",
        userId,
        error: 'User not found for sync studio video generation'
      };
    }

    //call sync studio video gen api with image, audio and text
    const data = await syncStudioVideo({
      job,
      userId,
      imagePath: imageData.Location,
      audioPath: audioData.Location,
      text,
      isVoiceCloning
    });

    //delete uploaded image and audio from cloudinary
    // image
    await deleteFileFromS3(imageData.Key, S3_PRIVATE_BUCKET!).catch(err => console.log(`Failed to delete image ${imageData.Key}:`, err));

    // //audio
    await deleteFileFromS3(audioData.Key, S3_PRIVATE_BUCKET!).catch(err => console.log(`Failed to delete audio ${audioData.Key}:`, err));

    if (!data || !data.Location || !data.Key) {
      //sent sse to frontend to notify video gen failed
      return {
        stage: "video_generated",
        percent: 100,
        status: "failed",
        userId,
        error: 'Video generation failed'
      };
    }

    //save video info to db
    const newVideo = new Video({
      videoMetadata: {
        key: data.Key,
        url: data.Location,
      },
      user: userId,
      type: VideoType.SYNC_STUDIO_VIDEO,
      title: title,
      style: style,
      voiceCharacter: character
    })
    await newVideo.save();

    // //reduce user credits by 20
    await user.updateOne({
      $inc: {
        credits: -20
      }
    })

    // //send sse to frontend to notify video gen success with video url
    return {
      stage: "video_generated",
      percent: 100,
      status: "completed",
      userId,
      videoUrl: data.Location
    };
  } catch (error) {
    console.log('Error in performSyncStudioVideoGen:', error);
    return {
      stage: "video_generated",
      percent: 100,
      status: "failed",
      userId: job.data.userId,
      error: (error as Error).message || 'Video generation failed'
    };
  }
}

const tmpTask = async (job: Job) => {
  try {
    const {userId, audioData, imageData} = job.data;
    
    //delay function for testing
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    await delay(1000);
    //10% job progress
    await job.updateProgress({
      stage: "script_generated",
      percent : 10,
      status: "progress",
      userId 
    }); 

    await delay(9000);
    await job.updateProgress({
      stage : "video_pipline",
      percent: 60,
      status: "progress",
      userId
    })

    await delay(20000);

    //delete uploaded image and audio 
    await deleteFileFromS3(imageData.Key, S3_PRIVATE_BUCKET!).catch(err => console.log(`Failed to delete image ${imageData.Key}:`, err));

    await deleteFileFromS3(audioData.Key, S3_PRIVATE_BUCKET!).catch(err => console.log(`Failed to delete audio ${audioData.Key}:`, err));

    return {
      videoUrl: "https://zennvid-ai.s3.ap-south-1.amazonaws.com/videos/db7c35bf-f3ac-4414-a9e4-88411dc65cab",
      stage: "video_generated",
      percent: 100,
      status: "completed",
      userId
    }
  } catch (error) {
    console.log('Error in tmpTask:', error);
    return {
      Key: "",
      Location: "",
      error: (error as Error).message || 'Video generation failed',
      percent: 100,
      status: "failed",
    }
  }
}

export {syncStudioTask, tmpTask};