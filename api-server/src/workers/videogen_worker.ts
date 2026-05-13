
//create a queue
import { Worker, Job } from 'bullmq';
import { magicVideoJobName, queueName, syncStudioJobName } from '../env_var';
import { redisClient } from '../utils/redisClient';
import { createMagicVideo, syncStudioVideo } from '../AI Layer/service';
import Video, { VideoType } from '../api/video_generater/models/VideoSave';
import { User } from '../auth/model/User';
import { deleteFromCloudinary, extractPublicId } from '../utils/cloudinary';

//helper function to perfoem job of magic video gen
const performMagicVideoGen = async (job: Job) => {
  try {

    const {
      title, code, style, seconds, language, voice, userId
    } = job.data;

    if (!title || !code || !style || !seconds || !language || !voice || !userId) {
      console.log('Missing required data for magic video generation in job:', job.id);
      throw new Error('Missing required data for magic video generation');
    }

    //check userid exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found for sync studio video generation in job:', job.id, 'with userId:', userId);
      throw new Error('User not found for sync studio video generation');
    }

    //call magic video gen api
    const data = await createMagicVideo({
      job,
      userId,
      title,
      code,
      style,
      seconds,
      language,
      voice
    })


    if (!data) {
      //sent sse to frontend to notify video gen failed
      throw new Error('Video generation failed');
    }

    //save video info to db
    const newVideo = new Video({
      videoMetadata: {
        publicId: data.publicId,
        resourceType: data.resourceType,
        format: data.format,
      },
      user: userId,
      type: VideoType.MAGIC_STUDIO_VIDEO,
      title: title,
      style: style,
      language: language,
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
      videoUrl: data.url
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

//helper function to perfoem job of sync studio video gen
const performSyncStudioVideoGen = async (job: Job) => {
  try {
    const {
      imageUrl,
      audioUrl,
      text,
      userId,
      character, title, style, language
    } = job.data;

    if (!imageUrl || !audioUrl || !text || !userId || !character || !title || !style || !language || !userId) {
      console.log('Missing required data for sync studio video generation in job:', job.id);
      throw new Error('Missing required data for sync studio video generation');
    }

    //check userid exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found for sync studio video generation in job:', job.id, 'with userId:', userId);
      throw new Error('User not found for sync studio video generation');
    }

    //call sync studio video gen api with image, audio and text
    const data = await syncStudioVideo({
      job,
      userId,
      imagePath: imageUrl,
      audioPath: audioUrl,
      text
    });

    if (!data) {
      //sent sse to frontend to notify video gen failed
      throw new Error('Video generation failed');
    }


    // //delete uploaded image and audio from cloudinary
    //image
    await deleteFromCloudinary({
      publicId: extractPublicId(imageUrl),
      resource_type: "image"
    })

    // //audio
    await deleteFromCloudinary({
      publicId: extractPublicId(audioUrl),
      resource_type: "raw"
    })


    //save video info to db
    const newVideo = new Video({
      videoMetadata: {
        publicId: data?.publicId,
        resourceType: data?.resourceType,
        format: data?.format
      },
      user: userId,
      type: VideoType.SYNC_STUDIO_VIDEO,
      title: title,
      style: style,
      language: language,
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
      videoUrl: data.url
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

const tempJob = async (job: Job) => {
  try {
    const { userId } = job.data;
    if (!userId) {
      throw new Error('Missing userId in job data');
    }

    //simulate some work
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    //stage-1 with dealy 2000s
    await delay(2000);
    job.updateProgress({
      stage: "stage-1",
      percent: 25,
      status: "progress",
      userId
    });

    //satge-2 with dealy 3000s
    await delay(3000);
    job.updateProgress({
      stage: "stage-2",
      percent: 70,
      status: "progress",
      userId
    });

    //stage-3 with dealy 1000s
    await delay(1000);
    job.updateProgress({
      stage: "stage-3",
      percent: 90,
      status: "progress",
      userId
    });

    //return final result after 1s delay
    await delay(1000);
    return {
      stage: "completed",
      percent: 100,
      status: "completed",
      userId,
      videoUrl: "https://res.cloudinary.com/dpnae0bod/video/upload/v1778564088/zenvvidbg_weihbz.mp4"
    };

  } catch (error) {
    console.log('Error in tempJob:', error);
    return {
      stage: "video_generated",
      percent: 100,
      status: "failed",
      userId: 'tempUserId',
      error: (error as Error).message || 'Video generation failed'
    };
  }
}


// worker
const worker = new Worker(
  queueName,
  async (job: Job) => {

    //video gen task
    switch (job.name) {
      case magicVideoJobName:
        //call video gen api
        return await performMagicVideoGen(job);
      case syncStudioJobName:
        //call sync studio api
        return await performSyncStudioVideoGen(job);
      default:
        throw new Error(`Unhandled job type: ${job.name}`);
    }

  },
  {
    connection: redisClient as any,
    concurrency: 1, // How many videos to process at once on THIS machine
    removeOnComplete: {
      count: 0
    },
    removeOnFail: {
      age: 1 * 3600, // keep up to 1 hr
      count: 2,
    },
  }
);



worker.on('failed', (job, err) => {
  console.log('Job failed:', job?.id, 'with error:', err);
});

export default worker;