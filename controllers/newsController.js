// controllers/newsController.js
const News = require("../models/news");
const User = require("../models/User");

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

    const news = new News({
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

// GET NEWS BY AUTHOR
exports.getAuthorNews = async (req, res) => {
  try {
    const userId = req.user.id;
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

// GET NEWS BY ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: "News not found." });
    }

    res.status(200).json(news);
  } catch (err) {
    console.error("Error fetching news by ID:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
