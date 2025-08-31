import { Request, Response } from "express";
import expressAsyncHandler from "../../utils/expressAsync";
import connectToMongo from "../../utils/mongoConnection";
import { creditZodValidation } from "./schema";
import { User } from "../../auth/model/User";
import { formatResponse } from "../../utils/formateResponse";

export const updateCredit = expressAsyncHandler(async(req:Request,res:Response)=>{
  try {
    const {credits} = creditZodValidation.parse(req.body);

    await connectToMongo();

    await User.findByIdAndUpdate(req.user.id,{
      $inc:{
        credits : credits
      }
    })

    return formatResponse(res, 200, "credit succesfully update", true, {});

  } catch (error) {
    return formatResponse(res, 500, "credit not update", false, {});
  }
})