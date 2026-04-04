const PDFDocument = require("pdfkit");
const { dataUrlToBuffer } = require("./foundQrUtils");

function safe(value, fallback = "N/A") {
  return value === undefined || value === null || value === "" ? fallback : String(value);
}

function statusLabel(status) {
  if (status === "approved") return "APPROVED";
  if (status === "collected") return "COLLECTED";
  if (status === "rejected") return "REJECTED";
  return "PENDING";
}

function formatDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString();
}

function formatTime(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function buildApprovalPdf(claim) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const item = claim.claimItem || {};

    doc.fontSize(18).text("CLAIM APPROVAL DOCUMENT", { align: "center" });
    doc.moveDown(0.75);

    doc.fontSize(11).fillColor("#444").text(`Document ID: ${String(claim._id).slice(0, 8).toUpperCase()}`);
    doc.text(`Generated: ${new Date().toLocaleString()}`);
    doc.text(`Current Status: ${statusLabel(claim.status)}`);
    doc.moveDown();

    doc.fillColor("#000").fontSize(13).text("CLAIM DETAILS", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    doc.text(`Claimant Name: ${safe(claim.claimedBy)}`);
    doc.text(`Email: ${safe(claim.userEmail)}`);
    doc.text(`Mobile Phone Number: ${safe(claim.userPhone)}`);
    doc.text(`Date: ${safe(claim.claimDate)}`);
    doc.text(`Place: ${safe(claim.claimPlace)}`);
    doc.text(`Time: ${safe(claim.claimTime)}`);
    doc.text(`Claim Category: ${safe(claim.claimCategory)}`);
    doc.text(`Item Type: ${safe(claim.itemType)}`);
    doc.text(`Item Name: ${safe(claim.itemName || item.title)}`);
    doc.text(`Item Color: ${safe(claim.itemColor)}`);
    doc.moveDown();

    doc.fontSize(13).text("ITEM RECORD", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    doc.text(`Reported Item Name: ${safe(item.title)}`);
    doc.text(`Location: ${safe(item.location)}`);
    doc.text(`Reported Date: ${safe(item.foundDate || item.date)}`);
    doc.moveDown();

    doc.fontSize(13).text("AUTHORIZATION / VERIFICATION", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Authorization Details: ${safe(claim.authorizationDetails)}`);
    if (claim.phoneNumber) doc.text(`Mobile Number on Item: ${claim.phoneNumber}`);
    if (claim.imeiNumber) doc.text(`IMEI Number: ${claim.imeiNumber}`);
    if (claim.laptopContactNumber) doc.text(`Laptop Contact Number: ${claim.laptopContactNumber}`);
    if (claim.bookColor) doc.text(`Book Color: ${claim.bookColor}`);
    if (claim.bagColor) doc.text(`Bag Color: ${claim.bagColor}`);
    doc.moveDown();

    doc.fontSize(13).text("APPROVAL CONFIRMATION", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text("This claim has been approved. The item can be collected from security.");
    doc.text("Please collect your item through the main gate security. Present this document to the security officer.");
    if (claim.adminNote) {
      doc.moveDown(0.35);
      doc.text(`Admin Note: ${claim.adminNote}`);
    }
    doc.moveDown();

    doc.fillColor("#444").fontSize(10).text(
      "Security must verify the claimant details and document before releasing the item. After the handover, the claim should be marked as Item Collected in the system.",
      { align: "left" }
    );
    doc.moveDown(1.5);
    doc.fontSize(10).text("Lost & Claim Management System", { align: "center" });

    doc.end();
  });
}

function drawInfoRow(doc, label, value) {
  doc.font("Helvetica-Bold").fillColor("#0f172a").text(`${label}: `, { continued: true });
  doc.font("Helvetica").fillColor("#334155").text(safe(value));
}

function buildFoundScanPdf(item) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 48, size: "A4" });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const qrBuffer = dataUrlToBuffer(item.qrCodeData || "");

    doc.roundedRect(36, 28, 523, 120, 24).fillAndStroke("#eff6ff", "#c7d2fe");
    doc.fillColor("#0f172a").fontSize(24).font("Helvetica-Bold").text("Found Item Verification Slip", 56, 52);
    doc.fontSize(11).font("Helvetica").fillColor("#475569").text(
      "Generated from the QR scan page. This document contains limited item details only.",
      56,
      86,
      { width: 320 }
    );

    doc.roundedRect(36, 170, 340, 330, 24).fillAndStroke("#ffffff", "#e2e8f0");
    doc.roundedRect(392, 170, 167, 330, 24).fillAndStroke("#ffffff", "#e2e8f0");

    doc.fontSize(13).font("Helvetica-Bold").fillColor("#0f172a").text("Item Summary", 58, 194);
    doc.moveTo(58, 216).lineTo(344, 216).strokeColor("#e2e8f0").stroke();

    let y = 236;
    doc.fontSize(11);
    drawInfoRow(doc, "Item title", item.title);
    y = doc.y + 10;
    doc.y = y;
    drawInfoRow(doc, "Date", formatDate(item.foundDate));
    y = doc.y + 10;
    doc.y = y;
    drawInfoRow(doc, "Time", formatTime(item.foundDate));
    y = doc.y + 10;
    doc.y = y;
    drawInfoRow(doc, "Category", item.category);
    y = doc.y + 10;
    doc.y = y;
    drawInfoRow(doc, "Location", item.location);
    y = doc.y + 10;
    doc.y = y;
    drawInfoRow(doc, "Status", statusLabel(item.status));
    y = doc.y + 10;
    doc.y = y;
    drawInfoRow(doc, "Reported by", item.createdByName || "Campus user");
    y = doc.y + 20;
    doc.y = y;

    doc.font("Helvetica-Bold").fillColor("#0f172a").text("Privacy note", 58, doc.y);
    doc.moveDown(0.4);
    doc.font("Helvetica").fillColor("#475569").text(
      "This PDF intentionally excludes email addresses, phone numbers, student IDs, and any other personal contact details.",
      { width: 290 }
    );

    doc.fontSize(13).font("Helvetica-Bold").fillColor("#0f172a").text("QR Code", 426, 194, {
      width: 110,
      align: "center",
    });

    if (qrBuffer.length) {
      doc.image(qrBuffer, 412, 230, { fit: [126, 126], align: "center", valign: "center" });
    } else {
      doc.roundedRect(412, 230, 126, 126, 18).fillAndStroke("#f8fafc", "#cbd5e1");
      doc.fillColor("#64748b").fontSize(10).text("QR unavailable", 432, 285);
    }

    doc.fillColor("#334155").fontSize(10).font("Helvetica").text(
      "Security can scan this code again later to reopen the verification page.",
      412,
      375,
      { width: 126, align: "center" }
    );

    doc.roundedRect(36, 520, 523, 78, 20).fillAndStroke("#f8fafc", "#e2e8f0");
    doc.fillColor("#0f172a").fontSize(11).font("Helvetica-Bold").text("Verification instruction", 56, 544);
    doc.fillColor("#475569").font("Helvetica").text(
      "Use the system record and this PDF together when handing over the item. This document is for verification only and does not by itself authorize release without the required admin checks.",
      56,
      565,
      { width: 480 }
    );

    doc.fillColor("#94a3b8").fontSize(9).text(`Generated: ${new Date().toLocaleString()}`, 36, 772, {
      align: "center",
      width: 523,
    });

    doc.end();
  });
}

module.exports = { buildApprovalPdf, buildFoundScanPdf };
