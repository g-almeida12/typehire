import { ApplicationStatus } from "@/database/generated/enums";
import nodemailer from "nodemailer";
import CandidateStatusEmail from "./templates/CandidateStatusEmail";
import AccountVerificationEmail from "./templates/AccountVerificationEmail";
import { render } from "react-email";
import { ENV } from "@/utils/env/env.server";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.NODEMAILER_EMAIL,
    pass: ENV.NODEMAILER_APP_PASSWORD,
  },
});
const EMAIL_FROM = `TypeHire <no-reply@${ENV.NODEMAILER_EMAIL}>`;

export async function sendEmail({
  from,
  to,
  subject,
  html,
}: {
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  try {
    const response = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    if (response.rejected.length > 0) {
      console.error(
        "[email.ts] Attempt to send email failed: ",
        response.error,
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error("[email.ts] Attempt to send email failed: ", err);
    return false;
  }
}

export async function sendApplicationUpdateEmail(props: {
  to: string;
  userName: string;
  jobTitle: string;
  companyName: string;
  oldStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  feedback: string;
}) {
  const html = await render(
    <CandidateStatusEmail
      oldStatus={props.oldStatus}
      newStatus={props.newStatus}
      userName={props.userName}
      jobTitle={props.jobTitle}
      companyName={props.companyName}
      feedback={props.feedback}
    />,
  );

  return sendEmail({
    from: EMAIL_FROM,
    to: props.to,
    subject: `Atualização na candidatura: ${props.jobTitle}`,
    html,
  });
}

export async function sendAccountVerificationEmail(props: {
  to: string;
  userName: string;
  verificationUrl: string;
}) {
  const html = await render(
    <AccountVerificationEmail
      userName={props.userName}
      verificationUrl={props.verificationUrl}
    />,
  );

  return sendEmail({
    from: EMAIL_FROM,
    to: props.to,
    subject: "Confirme sua conta no TypeHire",
    html,
  });
}
