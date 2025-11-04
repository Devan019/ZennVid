import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "../utils/expressAsync";
import { formatResponse } from "../utils/formateResponse";
import bcrypt from "bcrypt"; 
import { User } from "../auth/model/User";
import { Provider, UserRole } from "../constants/provider";

export const createBulkUsers = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersToCreate = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    
    const daysDifference = Math.floor((today.getTime() - twoMonthsAgo.getTime()) / (1000 * 60 * 60 * 24));
    
    let totalUserCount = 0;

    
    for (let day = 0; day <= daysDifference; day++) {
      const dateForDay = new Date(twoMonthsAgo);
      dateForDay.setDate(twoMonthsAgo.getDate() + day);

    
      const usersForThisDay = Math.floor(Math.random() * 16); 

      for (let userNum = 0; userNum < usersForThisDay; userNum++) {
        totalUserCount++;
        
        
        const email = `user${totalUserCount}@example.com`;
        const username = `user${totalUserCount}`;
        const password = "password123";
        
      
        const provider = Math.random() > 0.5 ? Provider.CREDENTIALS : Provider.GOOGLE;
        
        
        const hashedPassword = provider === Provider.CREDENTIALS
          ? await bcrypt.hash(password, 10)
          : undefined;

      
        usersToCreate.push({
          email,
          username,
          password: hashedPassword,
          provider,
          credits: 100, // Default credits
          profilePicture: provider === Provider.GOOGLE ? `https://ui-avatars.com/api/?name=${username}` : "",
          role: UserRole.USER,
          createdAt: dateForDay,
          updatedAt: dateForDay
        });
      }
    }

    
    const createdUsers = await User.insertMany(usersToCreate);

    
    const usersByDate: Record<string, number> = {};
    createdUsers.forEach(user => {
      const dateKey = user.createdAt.toISOString().split('T')[0];
      usersByDate[dateKey] = (usersByDate[dateKey] || 0) + 1;
    });

    return formatResponse(
      res, 
      201, 
      `Successfully created ${createdUsers.length} users across ${daysDifference + 1} days`, 
      true, 
      { 
        totalUsers: createdUsers.length,
        daysSpanned: daysDifference + 1,
        dateRange: {
          from: twoMonthsAgo.toISOString().split('T')[0],
          to: today.toISOString().split('T')[0]
        },
        usersByDate,
        providers: {
          CREDENTIALS: createdUsers.filter(u => u.provider === "CREDENTIALS").length,
          GOOGLE: createdUsers.filter(u => u.provider === "GOOGLE").length
        }
      }
    );
  } catch (error) {
    console.error("Error creating bulk users:", error);
    return formatResponse(res, 500, "Internal server error", false, error);
  }
});
