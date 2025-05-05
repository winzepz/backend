const News = require("../models/News");
const User = require("../models/User");
const generateUniqueNewsId = require('../utils/generateUniqueNewsId');

// CREATE NEWS
exports.createNews = async (req, res) => {
  try {
    const { title, tags, isDraft } = req.body;
    const { contentFile, imageFile } = req.files;

    if (!contentFile || !imageFile) {
      return res.status(400).json({ error: "Both PDF and image files are required." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const pdfUrl = contentFile[0].path;   // Cloudinary url 
    const imageUrl = imageFile[0].path;   // Cloudinary url

    const newsId = await generateUniqueNewsId();

    const news = new News({
      newsId,
      title,
      tags,
      image: imageUrl,
      content: pdfUrl,
      isDraft: isDraft || false,
      authorId: user.userId,
      authorName: user.fullName,
      status: "pending",
    });

    await news.save();

    res.status(201).json({
      message: "News created successfully",
      news,
    });
  } catch (err) {
    console.error("Error creating news:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// GET NEWS BY AUTHOR (Logged-in user's news)
exports.getAuthorNews = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id || req.user.id;

    const newsList = await News.find({ authorId: userId });

    if (newsList.length === 0) {
      return res.status(404).json({ message: "No news found for this author." });
    }

    res.status(200).json(newsList);
  } catch (err) {
    console.error("Error fetching author news:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};


// GET PUBLIC NEWS BY AUTHOR ID (Only Published)
exports.getNewsByAuthorId = async (req, res) => {
  try {
    const authorId = req.params.authorId;

    const newsList = await News.find({
      authorId,
      status: "published", 
      isDraft: false        
    });

    if (newsList.length === 0) {
      return res.status(404).json({ message: "No published news found for this author." });
    }

    res.status(200).json(newsList);
  } catch (err) {
    console.error("Error fetching public news by author ID:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};


// GET NEWS BY ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findOne({ newsId: req.params.id });  // Use newsId instead of MongoDB's ObjectId

    if (!news) {
      return res.status(404).json({ message: "News not found." });
    }

    res.status(200).json(news);
  } catch (err) {
    console.error("Error fetching news by ID:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// GET PUBLIC NEWS BY TAG
exports.getNewsByTags = async (req, res) => {
  try {
    const tag = req.params.tag;

    const newsList = await News.find({
      tags: { $in: [tag] },        
      status: "published",
      isDraft: false
    });

    if (newsList.length === 0) {
      return res.status(404).json({ message: "No news found with this tag." });
    }

    res.status(200).json(newsList);
  } catch (err) {
    console.error("Error fetching news by tag:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};



