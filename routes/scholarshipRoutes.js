const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarshipController');
const { verifyToken, verifyAdmin, verifyModerator } = require('../middlewares/verifyToken');

// Public
router.get('/scholarships', scholarshipController.getAllScholarships);
router.get('/scholarships/top', scholarshipController.getTopScholarships);
router.get('/scholarships/:id', scholarshipController.getScholarshipById);

// Protected (Admin only as per assignment)
router.post('/scholarships', verifyToken, verifyAdmin, scholarshipController.addScholarship);
router.patch('/scholarships/:id', verifyToken, verifyAdmin, scholarshipController.updateScholarship);
router.delete('/scholarships/:id', verifyToken, verifyAdmin, scholarshipController.deleteScholarship);

module.exports = router;
