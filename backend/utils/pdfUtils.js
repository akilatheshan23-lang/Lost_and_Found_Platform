const PDFDocument = require("pdfkit");

function safe(value, fallback = "N/A") {
  return value === undefined || value === null || value === "" ? fallback : String(value);
}

function statusLabel(status) {
  if (status === "approved") return "APPROVED";
  if (status === "collected") return "COLLECTED";
  if (status === "rejected") return "REJECTED";
  return "PENDING";
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
    // Some items might not have 'venue' if they are just from found model
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

module.exports = { buildApprovalPdf };
