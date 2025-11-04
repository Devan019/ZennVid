import { Request, Response } from "express";
import expressAsyncHandler from "../../utils/expressAsync";

import { creditZodValidation } from "./schema";
import { User } from "../../auth/model/User";
import { formatResponse } from "../../utils/formateResponse";
import { Transaction } from "./model";

export const updateCredit = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const { credits, paymentId, amount } = creditZodValidation.parse(req.body);

    const user = await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        credits: credits
      }
    }, { new: true });

    if (!user) {
      return formatResponse(res, 404, "User not found", false, {});
    }

    await Transaction.create({
      user: req.user.id,
      credits_received: credits,
      payment_id: paymentId,
      amount: amount
    })

    return formatResponse(res, 200, "credit succesfully update", true, {
      credits: user?.credits
    });

  } catch (error) {
    console.log(error)
    return formatResponse(res, 500, "credit not update", false, {});
  }
})