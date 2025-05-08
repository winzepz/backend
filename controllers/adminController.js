const News = require('../models/News');
const User = require('../models/User');

// GET All Pending News (testing done)
exports.getPendingNews = async (req, res) => {
  try {
    const pendingNews = await News.find({ status: 'pending' });
    res.status(200).json(pendingNews);
  } catch (err) {
    console.error('Error fetching pending news:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// APPROVE News (testing doneee)
exports.approveNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const news = await News.findOne({ newsId });

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    news.status = 'published';
    await news.save();

    res.status(200).json({ message: 'News approved and published.', news });
  } catch (err) {
    console.error('Error approving news:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// REJECT News (Testing Done  )
exports.rejectNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const { reason } = req.body;

    const news = await News.findOne({ newsId });

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    news.status = 'rejected';
    news.rejectionReason = reason || 'No reason provided';
    await news.save();

    res.status(200).json({ message: 'News rejected.', news });
  } catch (err) {
    console.error('Error rejecting news:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// GET VERIFIED AUTHORS
exports.getVerifiedAuthors = async (req, res) => {
  try {
    const verifiedAuthors = await User.find({
      role: 'author',
      isVerified: true
    })
      .select('-password')
      .sort({ createdAt: -1 });

    if (verifiedAuthors.length === 0) {
      return res.status(404).json({ message: 'No verified authors found.' });
    }

    res.status(200).json(verifiedAuthors);
  } catch (err) {
    console.error('Error fetching verified authors:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// GET NOT VERIFIED AUTHORS
exports.getUnverifiedAuthors = async (req, res) => {
  try {
    const unverifiedAuthors = await User.find({
      role: 'author',
      isVerified: false
    })
      .select('-password')
      .sort({ createdAt: -1 });

    if (unverifiedAuthors.length === 0) {
      return res.status(404).json({ message: 'No unverified authors found.' });
    }

    res.status(200).json(unverifiedAuthors);
  } catch (err) {
    console.error('Error fetching unverified authors:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// APPROVE AUTHOR (SET isVerified = true)
exports.approveAuthor = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId, role: 'author' });

    if (!user) {
      return res.status(404).json({ message: 'Author not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Author is already verified' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Author verified successfully', user });
  } catch (err) {
    console.error('Error approving author:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
