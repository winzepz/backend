const express = require('express');
const router = express.Router();

const { protect, isAdmin } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

router.get('/pending-news', protect, isAdmin, adminController.getPendingNews);
router.put('/approve/:newsId', protect, isAdmin, adminController.approveNews);
router.put('/reject/:newsId', protect, isAdmin, adminController.rejectNews);
router.get('/authors/verified', adminController.getVerifiedAuthors);
router.get('/authors/unverified', adminController.getUnverifiedAuthors);
router.put('/authors/approve/:userId', adminController.approveAuthor);
module.exports = router;
