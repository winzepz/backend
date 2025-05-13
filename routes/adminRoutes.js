const express = require('express');
const router = express.Router();

const { protect, isAdmin } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

// Route to get all pending news
router.get('/pending-news', protect, isAdmin, adminController.getPendingNews);

// Route to approve a news article
router.put('/approve/:newsId', protect, isAdmin, adminController.approveNews);

// Route to reject a news article
router.put('/reject/:newsId', protect, isAdmin, adminController.rejectNews);

// Route to get all verified authors
router.get('/authors/verified', protect, isAdmin, adminController.getVerifiedAuthors);

// Route to get all unverified authors
router.get('/authors/unverified', protect, isAdmin, adminController.getUnverifiedAuthors);

// Route to approve an author
router.put('/authors/approve/:userId', protect, isAdmin, adminController.approveAuthor);

// Route to delete a user (admin only)
router.delete('/author/:userId', protect, isAdmin, adminController.deleteUser);

// Route to delete news (admin only)
router.delete('/news/:newsId', protect, isAdmin, adminController.deleteNews);

// GET deleted users (Admin only)
router.get('/deleted-users', protect, isAdmin, adminController.getDeletedUsers);

// GET deleted news (Admin only)
router.get('/deleted-news', protect, isAdmin, adminController.getDeletedNews);

module.exports = router;
