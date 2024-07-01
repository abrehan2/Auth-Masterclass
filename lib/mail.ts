// IMPORTS -
import { Resend } from "resend";

// PARTIALS -
const resend = new Resend(process.env.RESEND_API_KEY);

// SEND EMAIL TO CONFIRM ACCOUNT -
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.VERIFICATION_URL}?token=${token}`;

  await resend.emails.send({
    from: String(process.env.EMAIL_HOST),
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
  });
};

// SEND EMAIL TO RESET PASSWORD -
export const sendVerificationForResetPassword = async (
  email: string,
  token: string
) => {
  const confirmLink = `${process.env.RESET_URL}?token=${token}`;

  await resend.emails.send({
    from: String(process.env.EMAIL_HOST),
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${confirmLink}">here</a> to change your password.</p>`,
  });
};

// SEND EMAIL TO CONFIRM TWO FACTOR AUTHENTICATION -
export const sendTwoFactorVerificationEmail = async (
  email: string,
  token: string
) => {
  await resend.emails.send({
    from: String(process.env.EMAIL_HOST),
    to: email,
    subject: "2FA code",
    html: `<p>Your 2FA code is ${token}</p>`,
  });
};
