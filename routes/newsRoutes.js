const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/cloudinaryUploader");
const {
  createNews,
  getAuthorNews,
  getNewsById,
  getNewsByTags,
  getNewsByAuthorId
} = require("../controllers/newsController");

const router = express.Router();

// CREATE NEWS
router.post(
  "/",
  protect,
  upload.fields([
    { name: "contentFile", maxCount: 1 },
    { name: "imageFile", maxCount: 1 },
  ]),
  createNews
);

// GET ALL NEWS BY AUTHOR (Logged-in user's news) (Testing Done)
router.get("/author", protect, getAuthorNews);

// GET SINGLE NEWS BY ID (Unique newsId) (testing Done)
router.get("/:id", getNewsById);

// GET NEWS BY TAGS (Filter news by tags) (testing Done)
router.get("/tags/:tag", getNewsByTags);

// Public route to get news by authorId (testing doneee)
router.get("/author/:authorId", getNewsByAuthorId);

module.exports = router;
