import { Job, Worker } from "bullmq";
import { magicVideoJobName, queueName, syncStudioJobName, videoUploadJobName } from "../env_var";
import { magicStudioTask } from "./tasks/magic_studio";
import { syncStudioTask } from "./tasks/sync_studio";
import { redisClient } from "../utils/redisClient";
import { videoSaveTask } from "./tasks/video_save";



//worker
const worker = new Worker(
  queueName,
  async (job: Job) => {

    //video gen task
    switch (job.name) {
      case magicVideoJobName:
        //call video gen api
        return await magicStudioTask(job);
      case syncStudioJobName:
        //call sync studio api
        return await syncStudioTask(job);
      case videoUploadJobName:
        //call video upload api
        // return await videoUploadTask(job);
        return await videoSaveTask(job);
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
    autorun: false
  }
);

worker.on('failed', (job, err) => {
  console.log('Job failed:', job?.id, 'with error:', err);
});

export default worker;