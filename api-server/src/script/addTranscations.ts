import { NextFunction, Request, Response } from "express";
import { Transaction } from "../api/pricing/model";
import { User } from "../auth/model/User";
import expressAsyncHandler from "../utils/expressAsync";
import { formatResponse } from "../utils/formateResponse";

export const createBulkTransactions = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
  
    const users = await User.find({});
    
    if (users.length === 0) {
      return formatResponse(res, 404, "No users found. Please create users first.", false, null);
    }

    const transactionsToCreate = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    
    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    
    const daysDifference = Math.floor((today.getTime() - twoMonthsAgo.getTime()) / (1000 * 60 * 60 * 24));
    
    
    const creditPackages = [
      { credits: 70, amount: 100 },
      { credits: 150, amount: 150 },
      { credits: 250, amount: 200 },
    ];

    
    for (let day = 0; day <= daysDifference; day++) {
      const dateForDay = new Date(twoMonthsAgo);
      dateForDay.setDate(twoMonthsAgo.getDate() + day);

    
      const transactionsForThisDay = Math.floor(Math.random() * 11); 

      for (let i = 0; i < transactionsForThisDay; i++) {
        
        const randomUser = users[Math.floor(Math.random() * users.length)];
        
        
        const randomPackage = creditPackages[Math.floor(Math.random() * creditPackages.length)];
        
        
        const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        transactionsToCreate.push({
          user: randomUser._id,
          credits_received: randomPackage.credits,
          payment_id: paymentId,
          amount: randomPackage.amount,
          createdAt: dateForDay,
          updatedAt: dateForDay
        });
      }
    }

    const createdTransactions = await Transaction.insertMany(transactionsToCreate);

    return formatResponse(
      res, 
      201, 
      `Successfully created ${createdTransactions.length} transactions`, 
      true, 
      { 
        totalTransactions: createdTransactions.length,
        daysSpanned: daysDifference + 1,
        dateRange: {
          from: twoMonthsAgo.toISOString().split('T')[0],
          to: today.toISOString().split('T')[0]
        }
      }
    );
  } catch (error) {
    console.error("Error creating bulk transactions:", error);
    return formatResponse(res, 500, "Internal server error", false, error);
  }
});