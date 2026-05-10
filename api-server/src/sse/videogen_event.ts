import { Job, QueueEvents } from "bullmq";
import { redisClient } from "../utils/redisClient";
import { Request, Response, Router } from "express";
import { active_job_data, active_job_time, queueName } from "../env_var";
import { videoQueue } from "../utils/bullmq-queue";

//helper function to update data
const updateLastStatus = async ({
  userId,
  jobId,
  status,
  stage,
  percent
}: {
  userId: string;
  jobId: string;
  status: string;
  stage: string;
  percent: number;
}) => {
  try {

    //1. get datakey 
    const dataKey = `${active_job_data}_${userId}`;

    //2. make pipeline
    const pipeline = redisClient.pipeline();

    //3. update redis stats
    pipeline.hset(dataKey, jobId, JSON.stringify({
      stage,
      progress: percent,
      status,
    }));

    //4. add expire for the data
    pipeline.expire(dataKey, active_job_time);

    //5. execute pipeline
    await pipeline.exec();

  } catch (error) {
    console.log(`Error updating last status for job ${jobId}:`, error);
  }
}


//job route for SSE connection to send job progress updates to the client
const JobRouter = Router();

//queue events listener for job progress updates
const queueEvents = new QueueEvents(queueName, { connection: redisClient as any });

//connection Map
const connections: Map<string, Set<Response>> = new Map();

//listener for job active
queueEvents.on('active', ({ jobId }) => {
  console.log(`ACTIVE_EVENT: Job ${jobId} is now active`);
});

// listen for job progress updates
queueEvents.on('progress', async ({ data, jobId }) => {
  console.log(`PROGRESS_EVENT: Received progress update for job ${jobId}:`, data);

  //get UserId
  const { userId, status, percent, stage } = data as any;

  if (!userId) {
    console.error(`PROGRESS_EVENT: Missing userId in progress data for job ${jobId}`);
    return;
  }

  //update redis data
  await updateLastStatus({
    userId,
    jobId,
    status,
    stage,
    percent
  });

  //get all connections for the jobId
  const jobConnections = connections.get(jobId);

  //send to adll connected clients for the jobId
  if (jobConnections) {
    jobConnections.forEach(res => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }
});
// listen for job completion
queueEvents.on('completed', async ({ returnvalue, jobId }) => {
  console.log(`COMPLETED_EVENT: Job ${jobId} completed with return value:`, returnvalue);
  //get UserId
  const { userId } = returnvalue as any;

  if (!userId) {
    console.log(`COMPLETED_EVENT: Missing userId in completed data for job ${jobId}`);
    return;
  }

  //update redis data
  await updateLastStatus({
    userId,
    jobId,
    status: "completed",
    stage: "completed",
    percent: 100
  });

  //get all connections for the jobId
  const jobConnections = connections.get(jobId);
  //send to adll connected clients for the jobId
  if (jobConnections) {
    jobConnections.forEach(res => {
      res.write(`data: ${JSON.stringify(returnvalue)}\n\n`);
      res.end(); // Close the connection after sending the completion message
    });
    connections.delete(jobId); // Clean up connections for the completed job
  }
});
// listen for job failures
queueEvents.on('failed', async ({ failedReason, jobId }) => {
  console.log(`FAILED_EVENT: Job ${jobId} failed with reason:`, failedReason);

  const job = await Job.fromId(videoQueue, jobId);

  //get UserId
  const { userId } = job?.data as any;

  if (!userId) {
    console.error(`FAILED_EVENT: Missing userId in failed reason for job ${jobId}`);
    return;
  }

  //update redis data
  await updateLastStatus({
    userId,
    jobId,
    status: "failed",
    stage: "failed",
    percent: 0
  });
});

// Listen for job progress updates and send them to the client via SSE
JobRouter.get("/:jobid", async (req: Request, res: Response) => {
  const { jobid } = req.params;

  if (!jobid) {
    res.status(400).json({ SUCCESS: false, MESSAGE: "Job ID is required" });
    return;
  }

  const jobId = Array.isArray(jobid) ? jobid[0] : jobid; // Handle case where jobid might be an array
  console.log(`Received SSE connection request for job: ${jobId}`);

  //new conection for the JOB
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.flushHeaders(); // Tell Express to send headers NOW

  // Send an initial "Connected" message so the client knows it's working
  res.write(`data: ${JSON.stringify({ status: "connected" })}\n\n`);

  //store res at connections map for the jobid
  //if not then create a new set for the jobid and add the res to the set
  if (!connections.has(jobId)) {
    connections.set(jobId, new Set());
  }
  //add current res to the set of connections for the jobid
  connections.get(jobId)?.add(res);

  console.log(`job ${jobId} connected to SSE for job updates`);
  // Clean up when the user closes the tab or job finishes
  req.on('close', () => {
    //close the connection and remove from the connections map
    console.log(`SSE connection closed for job: ${jobId}`);
    const jobConnections = connections.get(jobId);
    if (jobConnections) {
      //delete the current res from the set of connections for the jobid
      jobConnections.delete(res);
      if (jobConnections.size === 0) {

        //delete the jobid from the connections map if there are no more connections for the jobid
        connections.delete(jobId);
      }
    }
  });
});

export default JobRouter;