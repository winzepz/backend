const express = require('express');
const router = express.Router();
const News = require('../models/News');
const User = require('../models/User');

const isDevOnly = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'God Mode is disabled in production' });
  }
  next();
};

router.use(isDevOnly);

// GET api/dev/godmode/news — Get latest 10 news
router.get('/godmode/news', async (req, res) => {
    try {
      const news = await News.find()
        .sort({ createdAt: -1 }) // Latest first
        .limit(10);
      
      res.json({ total: news.length, news });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch news', error: err.message });
    }
  });
  

// GET api/dev/godmode/account — Get latest 10 users
router.get('/godmode/account', async (req, res) => {
    try {
      const users = await User.find()
        .sort({ createdAt: -1 }) // Latest first
        .limit(10);
  
      res.json({ total: users.length, users });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch accounts', error: err.message });
    }
  });
  
module.exports = router;
