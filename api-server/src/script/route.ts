import { Router } from "express";
import { createBulkUsers } from "./addusers";
import { createBulkOpenApiApps } from "./addApps";
import { createBulkVideos } from "./addVideos";
import { createBulkTransactions } from "./addTranscations";

export const scriptRouter = Router();

scriptRouter.get("/add-users", createBulkUsers);
scriptRouter.get("/add-apps", createBulkOpenApiApps);
scriptRouter.get("/add-videos", createBulkVideos);
scriptRouter.get("/add-transactions", createBulkTransactions);