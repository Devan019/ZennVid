import { Resend } from 'resend';
import { RESEND_KEY } from '../env_var';

const resend = new Resend(RESEND_KEY);


export const sendMail = async({from, to, subject, html} : {
  from: string;
  to: string;
  subject: string;
  html: string;
}) => {
  await resend.emails.send({
    from,
    to,
    subject,
    html
  });
} 