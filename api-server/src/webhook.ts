import express from 'express';
import expressAsyncHandler from './utils/expressAsync';
import { razorpay_webhook_secret } from './env_var';
import crypto from 'crypto';
import { redisClient } from './utils/redisClient';
import { User } from './auth/model/User';
import { Transaction } from './api/pricing/model';
import { sendMail } from './utils/SendMail';

const webhookRouter = express.Router();
const paymentEventRouter = express.Router();

//map
const paymentConnections = new Map();

paymentEventRouter.get('/stream/:paymentId', async (req, res) => {
  const { paymentId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");


  const existingStatus = await redisClient.get(`payment_status:${paymentId}`);

  // webhook already completed
  if (existingStatus) {
    res.write(
      `data: ${existingStatus}\n\n`
    );
    res.end();
    return;
  }

  paymentConnections.set(paymentId, res);

  req.on("close", () => {
    paymentConnections.delete(paymentId);
  });

});


//  Webhook Secret (get this from the Svix Dashboard)
const WEBHOOK_SECRET = razorpay_webhook_secret!;

webhookRouter.post('/payment', expressAsyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"] as string;

  const expectedSignature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(req.body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({
      success: false,
      message: "Invalid signature"
    });
  }

  const event = JSON.parse(req.body.toString());

  if (event.event === "payment.captured") {
    //data of the payment
    const paymentData = event.payload.payment.entity;

    //get data
    const orderId = paymentData.order_id;

    //get from redis
    const data = await redisClient.get(`order:${orderId}`);

    if (!data) {
      console.log("Order not found in redis");
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }


    //delete from redis
    await redisClient.del(`order:${orderId}`);
    const { userId, amount, credits } = JSON.parse(data);
    if (!userId) {
      console.log("User ID not found in redis data");
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found in database");
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    //update credits in database
    user.credits += credits;
    await user.save();

    //add transaction in database
    await Transaction.create({
      user: userId,
      credits_received: credits,
      payment_id: paymentData.id,
      amount
    });
    // save status
    await redisClient.setex(`payment_status:${paymentData.id}`, 60 * 5, JSON.stringify({
      success: true,
    }));

    //get client 
    const client = paymentConnections.get(paymentData.id);

    if (client) {
      client.write(
        `data: ${JSON.stringify({
          success: true,
        })}\n\n`
      );

      client.end();

      paymentConnections.delete(paymentData.id);
    }

    //send mail
    await sendMail({
      from: "ZennVid <devanchauhan012@gmail.com>",
      to: user.email,
      subject: "Payment Successful • Credits Added",
      html: `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>

    <body style="
      margin: 0;
      padding: 0;
      background: #f5f5f5;
      font-family: Arial, sans-serif;
    ">
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="padding: 40px 20px;"
      >
        <tr>
          <td align="center">
            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              style="
                max-width: 620px;
                background: #ffffff;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0,0,0,0.08);
              "
            >
              <!-- HEADER -->
              <tr>
                <td
                  style="
                    background: #000000;
                    padding: 40px;
                    text-align: center;
                  "
                >
                  <h1 style="
                    margin: 0;
                    color: #ffffff;
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: -1px;
                  ">
                    ZennVid
                  </h1>

                  <p style="
                    margin-top: 10px;
                    color: rgba(255,255,255,0.7);
                    font-size: 14px;
                  ">
                    AI Cinematic Video Platform
                  </p>
                </td>
              </tr>

              <!-- BODY -->
              <tr>
                <td style="padding: 42px;">
                  <h2 style="
                    margin: 0;
                    font-size: 28px;
                    color: #111111;
                  ">
                    Payment Successful 🎉
                  </h2>

                  <p style="
                    margin-top: 18px;
                    font-size: 16px;
                    line-height: 1.7;
                    color: #555555;
                  ">
                    Hello <strong>${user.username}</strong>,
                  </p>

                  <p style="
                    margin-top: 12px;
                    font-size: 16px;
                    line-height: 1.7;
                    color: #555555;
                  ">
                    Your payment has been processed successfully and your credits
                    have been added to your ZennVid account.
                  </p>

                  <!-- PAYMENT CARD -->
                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      margin-top: 28px;
                      background: #f8f8f8;
                      border-radius: 20px;
                      padding: 28px;
                    "
                  >
                    <tr>
                      <td>
                        <p style="
                          margin: 0;
                          font-size: 13px;
                          color: #888888;
                          text-transform: uppercase;
                          letter-spacing: 1.5px;
                        ">
                          Credits Added
                        </p>

                        <h3 style="
                          margin: 10px 0 0 0;
                          font-size: 42px;
                          color: #111111;
                        ">
                          ${credits}
                        </h3>
                      </td>

                      <td align="right">
                        <p style="
                          margin: 0;
                          font-size: 13px;
                          color: #888888;
                          text-transform: uppercase;
                          letter-spacing: 1.5px;
                        ">
                          Amount Paid
                        </p>

                        <h3 style="
                          margin: 10px 0 0 0;
                          font-size: 32px;
                          color: #111111;
                        ">
                          ₹${amount}
                        </h3>
                      </td>
                    </tr>
                  </table>

                  <!-- PAYMENT ID -->
                  <div style="
                    margin-top: 24px;
                    padding: 18px 20px;
                    border-radius: 16px;
                    background: #fafafa;
                    border: 1px solid #eeeeee;
                  ">
                    <p style="
                      margin: 0;
                      font-size: 13px;
                      color: #888888;
                      text-transform: uppercase;
                      letter-spacing: 1px;
                    ">
                      Payment ID
                    </p>

                    <p style="
                      margin-top: 8px;
                      font-size: 15px;
                      color: #111111;
                      word-break: break-all;
                    ">
                      ${paymentData.id}
                    </p>
                  </div>

                  <!-- CTA -->
                  <div style="margin-top: 36px;">
                    <a
                      href="https://zennvid.com"
                      style="
                        display: inline-block;
                        padding: 16px 28px;
                        background: #000000;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 14px;
                        font-size: 14px;
                        font-weight: 600;
                      "
                    >
                      Open ZennVid
                    </a>
                  </div>

                  <p style="
                    margin-top: 36px;
                    font-size: 14px;
                    line-height: 1.7;
                    color: #777777;
                  ">
                    If you did not make this payment, please contact our support
                    team immediately.
                  </p>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td
                  style="
                    padding: 30px 40px;
                    background: #fafafa;
                    border-top: 1px solid #eeeeee;
                  "
                >
                  <p style="
                    margin: 0;
                    font-size: 13px;
                    color: #888888;
                    text-align: center;
                    line-height: 1.7;
                  ">
                    © ${new Date().getFullYear()} ZennVid. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `
    });


  }
  if (event.event === "payment.failed") {
    console.log("Payment failed");
    const paymentData = event.payload.payment.entity;
    console.log(paymentData);
    // Here you can add code to handle failed payments, such as notifying the user, etc.
  }

  return res.status(200).json({
    success: true
  });
}));

export { webhookRouter, paymentEventRouter }