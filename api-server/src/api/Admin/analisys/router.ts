import { Router } from "express";
import { changeDailyDeveloper, changeDailyRevenue, changeDailyUser, changeDailyVideo, getDeveloperStats, getTransactionHistory, getTranscationStats, getUserStats, getVideoStats } from "./controller";

/** 3 -> User stats, Developer stats, Transaction stats */
const  StatsRouter = Router();

StatsRouter.get("/userstats", getUserStats);
StatsRouter.get("/developerstats", getDeveloperStats);
StatsRouter.get("/videostats", getVideoStats);
StatsRouter.post("/transcation-history", getTransactionHistory);
StatsRouter.get("/transactionstats", getTranscationStats);
StatsRouter.post("/change-daily-revenue", changeDailyRevenue);
StatsRouter.post("/change-daily-video", changeDailyVideo);
StatsRouter.post("/change-daily-user", changeDailyUser);
StatsRouter.post("/change-daily-developer", changeDailyDeveloper);

export default StatsRouter