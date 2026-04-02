const fs = require("fs/promises");
const path = require("path");
const nodemailer = require("nodemailer");

const outboxDir = path.join(__dirname, "..", "runtime-mails");

function buildMailHtml({ claim }) {
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

async function writeFallbackMail({ to, subject, text }) {
  await fs.mkdir(outboxDir, { recursive: true });
  const filepath = path.join(outboxDir, `approval-${Date.now()}.txt`);
  await fs.writeFile(filepath, `TO: ${to}\nSUBJECT: ${subject}\n\n${text}`, "utf8");
  return filepath;
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
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const from = process.env.MAIL_FROM || smtpUser || "no-reply@lostclaim.local";

    if (!smtpHost || !smtpUser || !smtpPass) {
      const fallbackPath = await writeFallbackMail({ to, subject, text });
      return { sent: false, fallbackPath };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html: buildMailHtml({ claim }),
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
    const fallbackPath = await writeFallbackMail({ to, subject, text });
    console.error("Email sending failed, wrote fallback mail instead:", error.message);
    return { sent: false, fallbackPath };
  }
}

module.exports = { sendApprovalEmail };
