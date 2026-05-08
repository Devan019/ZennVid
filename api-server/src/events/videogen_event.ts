import { QueueEvents } from "bullmq";
import { redisClient } from "../utils/redisClient";
import { Request, Response, Router } from "express";
import { queueName } from "../env_var";

const JobRouter = Router();
const queueEvents = new QueueEvents(queueName, { connection: redisClient as any });

//Map to track active user connections
const activeConnections = new Map<string, Response>();


//helper function to send SSE message to a specific user
const cleanup = async (res: Response) => {
  await queueEvents.close();
  res.end();
};
const handleProgress = ({ data, jobId }: any, userId: string, res: Response) => {
  if (data && data.userId === userId) {
    res.write(`data: ${JSON.stringify({ ...data, jobId })}\n\n`);
  }
};
const handleCompleted = ({ returnvalue, jobId }: any, userId: string, res: Response) => {
  let result = typeof returnvalue === 'string' ? JSON.parse(returnvalue) : returnvalue;
  if (result && result.userId === userId) {
    res.write(`data: ${JSON.stringify({ status: "completed", result, jobId })}\n\n`);
    cleanup(res);
  }
};
const handleFailed = ({ failedReason, jobId }: any, userId: string, res: Response) => {
  res.write(`data: ${JSON.stringify({ status: "failed", error: failedReason, jobId })}\n\n`);
  cleanup(res);
}

JobRouter.get("/:userid", async (req: Request, res: Response) => {
  const { userid } = req.params;
  const userId = Array.isArray(userid) ? userid[0] : userid;

  if (!userId) {
    res.status(400).json({ SUCCESS: false, MESSAGE: "User ID is required" });
    return;
  }

  //check old connection for the user, if exist, close it
  if (activeConnections.has(userId)) {
    const oldConnection = activeConnections.get(userId);

    if (oldConnection) {
      oldConnection.write(`data: ${JSON.stringify({
        status: "disconnected",
        message: "You opened Magic Video in another tab. This tab is disconnected."
      })}\n\n`);
      //close old connection
      oldConnection.end();
    }
  }

  //new conection for the user

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.flushHeaders(); // Tell Express to send headers NOW

  // Send an initial "Connected" message so the client knows it's working
  res.write(`data: ${JSON.stringify({ status: "connected" })}\n\n`);

  //add connection to the map
  activeConnections.set(userId, res);

  console.log(`User ${userId} connected to SSE for job updates. Total connections: ${activeConnections.size}`);

  // listen for job progress updates
  queueEvents.on('progress', ({ jobId, data }) => handleProgress({ data, jobId }, userId, res));
  // listen for job completion
  queueEvents.on('completed', ({ jobId, returnvalue }) => handleCompleted({ returnvalue, jobId }, userId, res));
  // listen for job failures
  queueEvents.on('failed', ({ jobId, failedReason }) => handleFailed({ failedReason, jobId }, userId, res));
  
  
  // Clean up when the user closes the tab or job finishes
  req.on('close', () => cleanup(res));
});

export default JobRouter;