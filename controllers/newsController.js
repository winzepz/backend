const News = require("../models/News");
const User = require("../models/User");
const DeletedNews = require('../models/DeletedNews');
const DeletedUser = require('../models/DeletedUser');
const generateUniqueNewsId = require('../utils/generateUniqueNewsId');
const cloudinary = require('../config/cloudinary');

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
    const news = await News.findOne({ newsId: req.params.id });  

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

// GET ALL PUBLISHED NEWS (Public Access)
exports.getAllPublishedNews = async (req, res) => {
  try {
    const newsList = await News.find({
      status: "published",
      isDraft: false
    }).sort({ createdAt: -1 });

    if (newsList.length === 0) {
      return res.status(404).json({ message: "No published news available." });
    }

    res.status(200).json(newsList);
  } catch (err) {
    console.error("Error fetching all published news:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};


// Edit News by Author
exports.editNewsByAuthor = async (req, res) => {
  try {
    const { title, tags, isDraft } = req.body;
    const { newsId } = req.params;
    const authorId = req.user.userId;

    // Find the news by custom ID
    const news = await News.findOne({ newsId });

    if (!news) {
      return res.status(404).json({ success: false, message: "News not found" });
    }

    if (news.authorId !== authorId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Start with existing URLs
    let imageURL = news.image;
    let contentFileURL = news.content;

    // Upload new image if provided
    if (req.files?.imageFile) {
      const imageFile = req.files.imageFile[0];
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        folder: "newsportal_uploads",
        resource_type: "image",
        public_id: `${Date.now()}-${imageFile.originalname}`
      });
      imageURL = imageUpload.secure_url;
    }

    // Upload new PDF if provided
    if (req.files?.contentFile) {
      const contentFile = req.files.contentFile[0];
      const pdfUpload = await cloudinary.uploader.upload(contentFile.path, {
        folder: "newsportal_uploads",
        resource_type: "raw",
        public_id: `${Date.now()}-${contentFile.originalname}`
      });
      contentFileURL = pdfUpload.secure_url;
    }

    // Update the fields
    news.title = title;
    news.tags = tags;
    news.isDraft = isDraft;
    news.status = "pending";
    news.image = imageURL;
    news.content = contentFileURL;

    await news.save();

    res.status(200).json({
      success: true,
      message: "News updated and sent for re-approval.",
      data: news,
    });
  } catch (err) {
    console.error("Error updating news:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// GET TOP AUTHORS (Public Endpoint)
exports.getTopAuthors = async (req, res) => {
  try {
    const topAuthors = await News.aggregate([
      {
        $match: {
          status: "published",
          isDraft: false
        }
      },
      {
        $group: {
          _id: "$authorId",
          authorName: { $first: "$authorName" },
          totalPublishedNews: { $sum: 1 }
        }
      },
      {
        $sort: { totalPublishedNews: -1 }
      },
      {
        $limit: 10 
      }
    ]);

    if (topAuthors.length === 0) {
      return res.status(404).json({ message: "No published news found." });
    }

    res.status(200).json(topAuthors);
  } catch (err) {
    console.error("Error fetching top authors:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

//GET TOP CATEGORIES(Most used tags)
exports.getTopCategories = async (req, res) => {
  try {
    const topCategories = await News.aggregate([
      {
        $match: {
          status: "published",
          isDraft: false
        }
      },
      {
        $unwind: "$tags"
      },
      {
        $group: {
          _id: "$tags",
          totalNews: { $sum: 1 }
        }
      },
      {
        $sort: { totalNews: -1 }
      },
      {
        $limit: 10
      }
    ]);

    if (topCategories.length === 0) {
      return res.status(404).json({ message: "No published news found." });
    }

    res.status(200).json(topCategories);
  } catch (err) {
    console.error("Error fetching top categories:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};


// GET LOGGED-IN USER'S DRAFT NEWS
exports.getOwnDraftNews = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id || req.user.id;

    const drafts = await News.find({
      authorId: userId,
      isDraft: true
    }).sort({ createdAt: -1 });

    if (drafts.length === 0) {
      return res.status(404).json({ message: "No draft news found." });
    }

    res.status(200).json(drafts);
  } catch (err) {
    console.error("Error fetching user's draft news:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// DELETE OWN NEWS
exports.deleteOwnNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const authorId = req.user.userId

    const news = await News.findOne({ newsId: newsId });

    if (!news) {
      return res.status(404).json({ message: 'News not found.' });
    }

    if (news.authorId.toString() !== authorId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this article.' });
    }

    const deletedNews = new DeletedNews({
      ...news.toObject(),
      deletedAt: new Date(),
    });
    await deletedNews.save();

    await News.deleteOne({ newsId: newsId });

    res.status(200).json({ message: 'News deleted successfully.' });
  } catch (error) {
    console.error('Error deleting own news:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};