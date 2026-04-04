const crypto = require("crypto");
const QRCode = require("qrcode");

function getPublicAppUrl() {
  return (
    process.env.PUBLIC_APP_URL ||
    process.env.CLIENT_ORIGIN ||
    "http://localhost:5173"
  ).replace(/\/$/, "");
}

function generateFoundQrToken() {
  return crypto.randomBytes(18).toString("hex");
}

function buildFoundScanUrl(token) {
  return `${getPublicAppUrl()}/found/scan/${token}`;
}

async function buildFoundQrCodeData(token) {
  const scanUrl = buildFoundScanUrl(token);

  const qrCodeData = await QRCode.toDataURL(scanUrl, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 900,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });

  return {
    scanUrl,
    qrCodeData,
  };
}

function dataUrlToBuffer(dataUrl) {
  if (!dataUrl || !dataUrl.includes(",")) {
    return Buffer.alloc(0);
  }

  const base64 = dataUrl.split(",")[1] || "";
  return Buffer.from(base64, "base64");
}

module.exports = {
  generateFoundQrToken,
  buildFoundQrCodeData,
  buildFoundScanUrl,
  dataUrlToBuffer,
};