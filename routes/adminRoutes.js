const express = require('express');
const router = express.Router();

const { protect, isAdmin } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

router.get('/pending-news', protect, isAdmin, adminController.getPendingNews);
router.put('/approve/:newsId', protect, isAdmin, adminController.approveNews);
router.put('/reject/:newsId', protect, isAdmin, adminController.rejectNews);
router.get('/authors/verified', protect, isAdmin, adminController.getVerifiedAuthors);
router.get('/authors/unverified', protect, isAdmin, adminController.getUnverifiedAuthors);
router.put('/authors/approve/:userId', protect, isAdmin, adminController.approveAuthor);
router.delete('/author/:userId', protect, isAdmin, adminController.deleteUser);
module.exports = router;
