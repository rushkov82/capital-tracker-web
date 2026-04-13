import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpSecure = process.env.SMTP_SECURE === "true";
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

function sanitizeFrom(value: string | undefined) {
  if (!value) return value;
  return value.trim().replace(/^['"]|['"]$/g, "");
}

const mailFrom = sanitizeFrom(process.env.MAIL_FROM) || smtpUser || "hello@localhost";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error("SMTP не настроен");
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  return transporter;
}

export async function sendMail(input: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const tx = getTransporter();

  await tx.sendMail({
    from: mailFrom,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
}
