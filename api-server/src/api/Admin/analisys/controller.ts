import { Request, Response } from "express";
import expressAsyncHandler from "../../../utils/expressAsync";
import { formatResponse } from "../../../utils/formateResponse";
import { ISendResponse } from "../../../constants/interfaces";
import { changeDailyDeveloperService, changeDailyRevenueService, changeDailyUserService, changeDailyVideoService, developerStatsService, revenueStatsService, transcationHistroyService, userStatsService, videoStatsService } from "./service";
import { paginationSchema } from "./schema";

export const getUserStats = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const response:ISendResponse = await userStatsService();
    return formatResponse(res, response.status, response.message, response.success, response.data)
  } catch (error) {
    console.log(error)
    return formatResponse(res, 500, "Error fetching user statistics", false, null);
  }

});

export const getDeveloperStats = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const response:ISendResponse = await developerStatsService();
    return formatResponse(res, response.status, response.message, response.success, response.data)
  } catch (error) {
    console.log(error)
    return formatResponse(res, 500, "Error fetching developer statistics", false, null);
  }
});

export const getTranscationStats = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const response:ISendResponse = await revenueStatsService();
    const transactionHistory = await transcationHistroyService({ page: 1, limit: 10 });
    return formatResponse(res, response.status, response.message, response.success, {
      revenue: response.data,
      transactionHistory: transactionHistory.data
    })
  } catch (error) {
    console.log(error)
    return formatResponse(res, 500, "Error fetching revenue statistics", false, null);
  }
})

export const getTransactionHistory = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    console.log(req.body);  
    const {page, limit, search, createdAt} = paginationSchema.parse(req.body);
    const response:ISendResponse = await transcationHistroyService({ page, limit, search, createdAt });
    return formatResponse(res, response.status, response.message, response.success, response.data)
  } catch (error) {
    console.log(error)
    return formatResponse(res, 500, "Error fetching transaction history", false, null);
  }
})

export const getVideoStats = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const stats:ISendResponse = await videoStatsService();
    return formatResponse(res, stats.status, stats.message, stats.success, stats.data)
  } catch (error) {
    console.log(error)
    return formatResponse(res, 500, "Error fetching video statistics", false, null);
  }
});


export const changeDailyRevenue = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const {date, state} = req.body;
    const response:ISendResponse = await changeDailyRevenueService(date, state);
    return formatResponse(res, response.status, response.message, response.success, response.data)
  }
  catch (error) {
    console.log(error)
    return formatResponse(res, 500, "Error updating daily revenue", false, null);
  }
});

export const changeDailyVideo = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const {date, state} = req.body;
    const response:ISendResponse = await changeDailyVideoService(date, state);
    return formatResponse(res, response.status, response.message, response.success, response.data)
  }
  catch (error) {
    console.log(error)
    return formatResponse(res, 500, "Error daily video", false, null);
  }
});
export const changeDailyUser = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const {date, state} = req.body;
    const response:ISendResponse = await changeDailyUserService(date, state);
    return formatResponse(res, response.status, response.message, response.success, response.data)
  }
  catch (error) {
    console.log(error)
    return formatResponse(res, 500, "Error daily user", false, null);
  }
});
export const changeDailyDeveloper = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const {date, state} = req.body;
    const response:ISendResponse = await changeDailyDeveloperService(date, state);
    return formatResponse(res, response.status, response.message, response.success, response.data)
  }
  catch (error) {
    console.log(error)
    return formatResponse(res, 500, "Error daily developer", false, null);
  }
});