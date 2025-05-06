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
