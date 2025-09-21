import nodemailer from "nodemailer";
import { SMTP_USER, SMTP_PASS } from "../env_var"; 

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendMail = async ({
  from,
  to,
  subject,
  html,
}: {
  from: string;
  to: string;
  subject: string;
  html: string;
}) => {
  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
};
