const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define upload directory path
const uploadDir = path.join(__dirname, "../uploads");

// Create the uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Initialize upload middleware
const upload = multer({ storage });

module.exports = upload;
