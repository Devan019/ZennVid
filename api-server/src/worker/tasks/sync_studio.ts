import { Job } from "bullmq";
import { User } from "../../auth/model/User";
import { syncStudioVideo } from "../../AI Layer/service";
import Video, { VideoType } from "../../api/video_generater/models/VideoSave";
import { deleteFileFromS3 } from "../../utils/s3";

const syncStudioTask = async (job: Job) => {
  try {
    const {
      imageData,
      audioData,
      text,
      userId,
      character, title, style
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
      text
    });

    //delete uploaded image and audio from cloudinary
    // image
    await deleteFileFromS3(imageData.Key);

    // //audio
    await deleteFileFromS3(audioData.Key);

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

export {syncStudioTask}