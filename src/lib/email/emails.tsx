import { ApplicationStatus } from "@/database/generated/enums";
import nodemailer from "nodemailer";
import { CandidateStatusEmail } from "./templates/CandidateStatusEmail";
import { render } from "react-email";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_APP_PASSWORD,
  },
});

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
    from: `TypeHire <no-reply@${process.env.NODEMAILER_EMAIL}>`,
    to: props.to,
    subject: `Atualização na candidatura: ${props.jobTitle}`,
    html,
  });
}
