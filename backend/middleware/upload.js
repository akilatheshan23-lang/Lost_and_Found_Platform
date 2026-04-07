const multer = require("multer");
const fs = require("fs");
const path = require("path");

const createUpload = (folderName) => {
  const dir = path.join(__dirname, "..", "uploads", folderName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  return multer({ storage });
};

module.exports = {
  uploadLost: createUpload("lost"),
  uploadFound: createUpload("found"),
  uploadSocial: createUpload("social"),
  uploadMarketplace: createUpload("marketplace"),
};
