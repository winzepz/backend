const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/cloudinaryUploader");
const isVerified = require("../middlewares/isVerified");
const {
  createNews,
  getAuthorNews,
  getNewsById,
  getNewsByTags,
  getAllPublishedNews,
  getNewsByAuthorId,
  editNewsByAuthor,
  getTopAuthors,
  getTopCategories,
  getOwnDraftNews


} = require("../controllers/newsController");

const router = express.Router();

// CREATE NEWS
router.post(
  "/",
  protect,isVerified,
  upload.fields([
    { name: "contentFile", maxCount: 1 },
    { name: "imageFile", maxCount: 1 },
  ]),
  createNews
);

router.get('/drafts',protect, getOwnDraftNews);

// GET ALL NEWS BY AUTHOR (Logged-in user's news) (Testing Done)
router.get("/author", protect, getAuthorNews);

// Add this route for getting the top categories
router.get('/top-categories', getTopCategories);


// Public route to get top authors
router.get('/top-authors', getTopAuthors);

// GET SINGLE NEWS BY ID (Unique newsId) (testing Done)
router.get("/:id", getNewsById);

// GET NEWS BY TAGS (Filter news by tags) (testing Done)
router.get("/tags/:tag", getNewsByTags);



// Public route to get news by authorId (testing doneee)
router.get("/author/:authorId", getNewsByAuthorId);

// Public Route: Get All Published News
router.get("/public/news", getAllPublishedNews);

// Edit News By Author 
router.put("/:newsId/edit", protect, upload.fields([
  { name: 'imageFile', maxCount: 1 },
  { name: 'contentFile', maxCount: 1 }
]), editNewsByAuthor);

module.exports = router;
