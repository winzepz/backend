const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'newsportal_uploads',
    resource_type: file.mimetype.startsWith('application/pdf') ? 'raw' : 'image',
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

const upload = multer({ storage });

module.exports = upload;
