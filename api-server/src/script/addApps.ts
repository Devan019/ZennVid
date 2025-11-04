import { NextFunction, Request, Response } from "express";
import OpenApi from "../api/openapi/model";
import { User } from "../auth/model/User";
import expressAsyncHandler from "../utils/expressAsync";
import { formatResponse } from "../utils/formateResponse";

export const createBulkOpenApiApps = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    
    if (users.length === 0) {
      return formatResponse(res, 404, "No users found. Please create users first.", false, null);
    }

    const openApisToCreate = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    
    const daysDifference = Math.floor((today.getTime() - twoMonthsAgo.getTime()) / (1000 * 60 * 60 * 24));
    
    const appNames = [
      "My AI App", "ChatBot Pro", "Vision API", "Text Analyzer", 
      "Smart Assistant", "Content Generator", "Data Processor", 
      "AI Helper", "ML Service", "Auto Responder"
    ];

  
    for (let day = 0; day <= daysDifference; day++) {
      const dateForDay = new Date(twoMonthsAgo);
      dateForDay.setDate(twoMonthsAgo.getDate() + day);

    
      const appsForThisDay = Math.floor(Math.random() * 9); 

      for (let i = 0; i < appsForThisDay; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        
        
        const numApps = Math.floor(Math.random() * 3) + 1;
        const apps = [];
        
        for (let j = 0; j < numApps; j++) {
          const appName = appNames[Math.floor(Math.random() * appNames.length)];
          const apiKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          
          apps.push({
            appName: `${appName} ${j + 1}`,
            apiKeyHash: apiKey,
            apiKeyEncrypted: {
              iv: Math.random().toString(36).substring(2, 18),
              cipher: Math.random().toString(36).substring(2, 24)
            },
            created_at: dateForDay
          });
        }

        openApisToCreate.push({
          user: randomUser._id,
          apps: apps,
          apiCalls: Math.floor(Math.random() * 500),
          createdAt: dateForDay,
          updatedAt: dateForDay
        });
      }
    }

    const createdOpenApis = await OpenApi.insertMany(openApisToCreate);

    return formatResponse(
      res, 
      201, 
      `Successfully created ${createdOpenApis.length} OpenAPI entries`, 
      true, 
      { 
        totalOpenApis: createdOpenApis.length,
        totalApps: createdOpenApis.reduce((sum, api) => sum + api.apps.length, 0),
        daysSpanned: daysDifference + 1,
        dateRange: {
          from: twoMonthsAgo.toISOString().split('T')[0],
          to: today.toISOString().split('T')[0]
        }
      }
    );
  } catch (error) {
    console.error("Error creating bulk OpenAPI apps:", error);
    return formatResponse(res, 500, "Internal server error", false, error);
  }
});