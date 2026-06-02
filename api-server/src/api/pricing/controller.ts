import { Request, Response } from "express";
import expressAsyncHandler from "../../utils/expressAsync";
import { creditZodValidation, orderZodValidation } from "./schema";
import { User } from "../../auth/model/User";
import { formatResponse } from "../../utils/formateResponse";
import { Transaction } from "./model";
import Razorpay from "razorpay";
import { razorpay_key_id, razorpay_key_secret, razorpay_order_expire_time } from "../../env_var";
import { redisClient } from "../../utils/redisClient";
import { plans } from "../../data/plans";

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

//create razorpay order
export const createOrder = expressAsyncHandler(async (req: Request, res: Response) => {
  try{
    const { planId } = orderZodValidation.parse(req.body);

    const plan = plans.find((p) => p.id === planId);
    if (!plan) {
      return formatResponse(res, 400, "Invalid plan selected", false, {});
    }

    const instance = new Razorpay({
      key_id: razorpay_key_id!,
      key_secret: razorpay_key_secret!
    })

    const options = {
      amount: plan.amount * 100, // amount in the smallest currency unit
      currency: "INR",
    };

    const order = await instance.orders.create(options);
    const userId = req.user.id;

    //check already order exist in redis with same order id
    const existingOrder = await redisClient.get(`order:${order.id}`);
    if (existingOrder) {
      return formatResponse(res, 400, "Order already exists", false, {});
    }

    //add order to redis for 30min
    await redisClient.setex(`order:${order.id}`, razorpay_order_expire_time, JSON.stringify({
      userId,
      amount: plan.amount,
      credits: plan.credits,
      status: "created"
    }));

    return formatResponse(res, 200, "order created", true, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });

  }catch(error){
    console.log(error)
    return formatResponse(res, 500, "order not created", false, {});
  }
});