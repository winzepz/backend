
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/cloudinaryUploader");
const {
  createNews,
  getAuthorNews,
  getNewsById,
} = require("../controllers/newsController");

const router = express.Router();

router.post(
  "/",
  protect,
  upload.fields([
    { name: "contentFile", maxCount: 1 },
    { name: "imageFile", maxCount: 1 },
  ]),
  createNews
);

router.get("/author", protect, getAuthorNews);
router.get("/:id", getNewsById);

module.exports = router;
