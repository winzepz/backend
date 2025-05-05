
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "newsportal_uploads",
    resource_type: file.mimetype.startsWith("application/pdf") ? "raw" : "image",
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

const upload = multer({ storage });

module.exports = upload;
module.exports = cloudinary;
