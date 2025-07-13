import nodemailer, { SendMailOptions } from "nodemailer";
import envConfig from "../envConfig";
import { Attachment } from "nodemailer/lib/mailer";

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: envConfig.mailing.userName,
    pass: envConfig.mailing.password,
  },
});

export interface IMainOptions {
  subject: string;
  html: string;
  recipientMail: string;
  attachments?: Array<Attachment>;
}
const sendMail = async ({
  subject,
  html,
  recipientMail,
  attachments,
}: IMainOptions) => {
  const mailOptions: SendMailOptions = {
    // from: envConfig.mailing.userName,
    from: `"ClicknFix" <${envConfig.mailing.userName}>`,
    to: recipientMail,
    html,
    subject,
    attachments,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Mail sent successfully to ", recipientMail);
    return true;
  } catch (error) {
    console.log("ERROR AT NODEMAILER SENDMAIL:: ", error);
    return false;
  }
};

export default sendMail;
