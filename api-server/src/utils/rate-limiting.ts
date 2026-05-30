
//rate limit on a per user 
//sync studio -> 1 req/hour
//magic studio -> 1 req/hour
//as middleware
import { NextFunction, Request, Response } from "express";
import { redisClient } from "./redisClient";
import expressAsyncHandler from "./expressAsync";
import { formatResponse } from "./formateResponse";


const checkSyncStudioRateLimit = expressAsyncHandler(async(req: Request, res:Response, next:NextFunction) => {
  const userId = req.user.id; // Assuming you have user information in the request
  console.log("Checking Sync Studio rate limit for user:", userId);
  try {
    //1. get the current rate limit for the user from the redis
    const currentRateLimit = await redisClient.get(`sync-studio-rate-limit:${userId}`);
    console.log("Current Sync Studio rate limit for user:", userId, "is", currentRateLimit);

    //2. if the current rate limit is null, set it to 1 and set the expiry to 1 hour
    if (!currentRateLimit) {
      await redisClient.set(`sync-studio-rate-limit:${userId}`, "1", "EX", 3600);
    } else {
      //3. if the current rate limit is not null, send an error response to the client
      return formatResponse(res, 429, "You have reached the maximum number of requests for Sync Studio. Please try again after an hour.", false, null);
    }

    return next();

  } catch (error) {
    console.log("Error adding rate limit for Sync Studio:", error);
    return formatResponse(res, 500, "An error occurred while adding rate limit for Sync Studio. Please try again later.", false, null);
  }
});

const checkMagicStudioRateLimit = expressAsyncHandler(async(req: Request, res:Response, next:NextFunction) => {
  const userId = req.user.id; // Assuming you have user information in the request
  try {
    //1. get the current rate limit for the user from the redis
    const currentRateLimit = await redisClient.get(`magic-studio-rate-limit:${userId}`);

    //2. if the current rate limit is null, set it to 1 and set the expiry to 1 hour
    if (!currentRateLimit) {
      await redisClient.set(`magic-studio-rate-limit:${userId}`, "1", "EX", 3600);
    } else {
      //3. if the current rate limit is not null, send an error response to the client
      return formatResponse(res, 429, "You have reached the maximum number of requests for Magic Studio. Please try again after an hour.", false, null);
    }
  } catch (error) {
    console.log("Error adding rate limit for Magic Studio:", error);
    return formatResponse(res, 500, "An error occurred while adding rate limit for Magic Studio. Please try again later.", false, null);
  }
});

export { checkSyncStudioRateLimit, checkMagicStudioRateLimit };