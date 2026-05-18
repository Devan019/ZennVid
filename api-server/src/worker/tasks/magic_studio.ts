import { Job } from "bullmq";
import { User } from "../../auth/model/User";
import { createMagicVideo } from "../../AI Layer/service";
import Video, { VideoType } from "../../api/video_generater/models/VideoSave";

const magicStudioTask = async (job: Job) => {
  try {
    const {
      title, style, voice, userId
    } = job.data;

    if (!title || !style || !voice || !userId) {
      return {
        stage: "video_generated",
        percent: 100,
        status: "failed",
        userId,
        error: 'Missing required data for magic video generation'
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

    //call magic video gen api
    const data = await createMagicVideo({
      job,
      userId,
      title,
      style,
      voice
    })


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
      type: VideoType.MAGIC_STUDIO_VIDEO,
      title: title,
      style: style,
      voiceCharacter: voice
    })

    await newVideo.save();

    // //reduce user credits by 20
    await user.updateOne({
      $inc: {
        credits: -20
      }
    })

    return {
      stage: "video_generated",
      percent: 100,
      status: "completed",
      userId,
      videoUrl: data.Location
    };

    //sse sent to frontend to notify video gen success with video url
  } catch (error) {
    return {
      stage: "video_generated",
      percent: 100,
      status: "failed",
      userId: job.data.userId,
      error: (error as Error).message || 'Video generation failed'
    }
  }
}

export {magicStudioTask}