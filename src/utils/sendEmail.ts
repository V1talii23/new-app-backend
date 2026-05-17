import { Resend } from "resend";
import { render } from "@react-email/render";
import ResetPasswordEmail from "../templates/resetEmail.jsx";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (email: string, token: string) => {
  const isProd = process.env.NODE_ENV === "production";

  const link = `${process.env.FRONTEND_URL}/reset-email?token=${token}`;

  const html = await render(ResetPasswordEmail(link));

  const data = await resend.emails.send({
    from: isProd ? process.env.EMAIL_FROM! : "onboarding@resend.dev",
    to: isProd ? email : process.env.DEV_EMAIL!,
    subject: "Request Reset Email ",
    html,
  });
  return data;
};
