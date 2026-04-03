const fs = require("fs/promises");
const path = require("path");
const nodemailer = require("nodemailer");

const outboxDir = path.join(__dirname, "..", "runtime-mails");

function buildClaimMailHtml({ claim }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="margin-bottom: 8px;">Claim Approved</h2>
      <p>Hello ${claim.claimedBy},</p>
      <p>Your claim has been approved.</p>
      <p><strong>The item can be collected from security.</strong></p>
      <p>Please collect your item through the main gate security. Present this document to the security officer.</p>
      <p>Claim item: <strong>${claim.itemName || claim.claimItem?.title || "Item"}</strong></p>
      <p>Status: <strong>${claim.status}</strong></p>
      <p>Thank you.</p>
    </div>
  `;
}

function buildFoundQrMailHtml({ userName, itemTitle, scanUrl }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin-bottom: 8px;">Found Item Approved</h2>
      <p>Hello ${userName || "User"},</p>
      <p>Your found item post for <strong>${itemTitle}</strong> has been approved by the admin team.</p>
      <p>The QR code attached to this email can be downloaded and shared with security officers for quick verification.</p>
      <p><strong>Scan page:</strong> <a href="${scanUrl}">${scanUrl}</a></p>
      <p>This QR only opens limited item details and does not expose private contact information.</p>
      <p>Thank you.</p>
    </div>
  `;
}

async function writeFallbackMail({ to, subject, text, prefix = "mail" }) {
  await fs.mkdir(outboxDir, { recursive: true });
  const filepath = path.join(outboxDir, `${prefix}-${Date.now()}.txt`);
  await fs.writeFile(filepath, `TO: ${to}\nSUBJECT: ${subject}\n\n${text}`, "utf8");
  return filepath;
}

function buildTransport() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM || smtpUser || "no-reply@lostclaim.local";

  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  return { transporter, from };
}

async function sendApprovalEmail({ to, claim, pdfBuffer, filename }) {
  const subject = "Claim Approved - Collect Your Item From Security";
  const text = [
    `Hello ${claim.claimedBy},`,
    "",
    "Your claim has been approved.",
    "The item can be collected from security.",
    "",
    "Please collect your item through the main gate security. Present this document to the security officer.",
    "",
    `Item: ${claim.itemName || claim.claimItem?.title || "Item"}`,
    `Status: ${claim.status}`,
  ].join("\n");

  try {
    const mail = buildTransport();
    if (!mail) {
      const fallbackPath = await writeFallbackMail({ to, subject, text, prefix: "approval" });
      return { sent: false, fallbackPath };
    }

    await mail.transporter.sendMail({
      from: mail.from,
      to,
      subject,
      text,
      html: buildClaimMailHtml({ claim }),
      attachments: [
        {
          filename,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    return { sent: true, fallbackPath: "" };
  } catch (error) {
    const fallbackPath = await writeFallbackMail({ to, subject, text, prefix: "approval" });
    console.error("Email sending failed, wrote fallback mail instead:", error.message);
    return { sent: false, fallbackPath };
  }
}

async function sendFoundQrEmail({ to, userName, itemTitle, scanUrl, qrPngBuffer, filename }) {
  const subject = "Found Item Approved - Download Your QR Code";
  const text = [
    `Hello ${userName || "User"},`,
    "",
    `Your found item post for "${itemTitle}" has been approved.`,
    "The QR code is attached to this email.",
    "",
    `Scan page: ${scanUrl}`,
    "Only limited item details are shown when the code is scanned.",
  ].join("\n");

  try {
    const mail = buildTransport();
    if (!mail) {
      const fallbackPath = await writeFallbackMail({ to, subject, text, prefix: "found-qr" });
      return { sent: false, fallbackPath };
    }

    await mail.transporter.sendMail({
      from: mail.from,
      to,
      subject,
      text,
      html: buildFoundQrMailHtml({ userName, itemTitle, scanUrl }),
      attachments: [
        {
          filename,
          content: qrPngBuffer,
          contentType: "image/png",
        },
      ],
    });

    return { sent: true, fallbackPath: "" };
  } catch (error) {
    const fallbackPath = await writeFallbackMail({ to, subject, text, prefix: "found-qr" });
    console.error("QR email sending failed, wrote fallback mail instead:", error.message);
    return { sent: false, fallbackPath };
  }
}

module.exports = { sendApprovalEmail, sendFoundQrEmail };
