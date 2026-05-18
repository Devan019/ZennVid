import { Job } from "bullmq";
import fs from "fs";
import { uploadFileToS3 } from "../../utils/s3";
import { video_prefix } from "../../env_var";
import Video from "../../api/video_generater/models/VideoSave";

//helper fun to delete file from local storage
const deleteLocalFile = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(`Failed to delete file at ${filePath}:`, err);
    } 
  });
};

const videoSaveTask = async (job: Job) => {
  try {
    //1. get videopath from job
    const { videoPath, userId } = job.data;
    if (!videoPath) {
      throw new Error("Invalid job data: videoPath is required");
    }

    if (!userId) {
      throw new Error("Invalid job data: userId is required");
    }

    //2. save video to storage
    const res = await uploadFileToS3({
      filePath: videoPath,
      prefix: video_prefix,
      contentType: "video/mp4",
    })

    if(!res){
      throw new Error("Failed to upload video to S3");
    }

    //3. update video url in database
    await Video.findOneAndUpdate(
      {user: userId},
      {
        $set:{
          videoMetadata:{
            url: res.Location,
            key: res.Key
          }
        }
      }
    )

    //4. delete video from local storage
    deleteLocalFile(videoPath);

  } catch (error) {
    console.log("Error occurred while saving video:", error);
  }
}

export {videoSaveTask}