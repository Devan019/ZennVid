import { Request, Response, Router } from "express";
import { sendMail } from "../utils/SendMail";
import expressAsyncHandler from "../utils/expressAsync";
import { formatResponse } from "../utils/formateResponse";
import axios from "axios";
import path from "path";
import fs from "fs/promises";

export const TestRouter = Router();

TestRouter.get("/sendmail", expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    await sendMail({
      from: 'onboarding@resend.dev',
      to: 'devanchauhan012@gmail.com',
      subject: 'Test Email',
      html: '<p>Test!</p>'
    });
    return formatResponse(res, 200, "mail send successfully", true);
  } catch (error) {
    console.error("Error sending mail:", error);
    return formatResponse(res, 500, "Failed to send mail", false);
  }
}));


TestRouter.get("/languages", expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    console.log("Fetching languages...");
    const filePath = path.join("src/test/audio.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    const languages = data.map((item: any) => {
      return item.language;
    });

    return formatResponse(res, 200, "Languages fetched successfully", true, languages);
  } catch (error) {
    console.error("Error fetching languages:", error);
    return formatResponse(res, 500, "Failed to fetch languages", false, {});
  }
}));

