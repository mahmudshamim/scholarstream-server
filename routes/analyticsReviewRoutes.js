const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const analyticsController = require('../controllers/analyticsController');
const { verifyToken, verifyAdmin, verifyModerator } = require('../middlewares/verifyToken');

// Analytics (Admin)
router.get('/analytics', verifyToken, verifyAdmin, analyticsController.getUsersStats);

// Reviews
router.post('/reviews', verifyToken, reviewController.addReview);
router.get('/reviews/:scholarshipId', reviewController.getReviewsByScholarshipId); // Public
router.get('/reviews/user/:email', verifyToken, reviewController.getReviewsByEmail); // Student own
router.get('/all-reviews', verifyToken, verifyModerator, reviewController.getAllReviews); // Mod all
router.delete('/reviews/:id', verifyToken, reviewController.deleteReview); // Student/Mod/Admin
router.put('/reviews/:id', verifyToken, reviewController.updateReview); // Student own

module.exports = router;
