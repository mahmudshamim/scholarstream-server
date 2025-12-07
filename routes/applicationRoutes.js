const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const applicationController = require('../controllers/applicationController');
const { verifyToken, verifyAdmin, verifyModerator } = require('../middlewares/verifyToken');

// Payment
router.post('/create-payment-intent', verifyToken, paymentController.createPaymentIntent);

// Applications
router.post('/applications', verifyToken, applicationController.submitApplication);
router.get('/applications/user/:email', verifyToken, applicationController.getApplicationsByEmail);
router.get('/applications/:id', verifyToken, applicationController.getApplicationById); // Details modal
router.put('/applications/:id', verifyToken, applicationController.updateApplication); // Edit pending app
router.delete('/applications/:id', verifyToken, applicationController.deleteApplication);

// Moderator/Admin Routes for Applications
router.get('/applications', verifyToken, verifyModerator, applicationController.getAllApplications);
router.patch('/applications/status/:id', verifyToken, verifyModerator, applicationController.updateApplicationStatus);
router.patch('/applications/feedback/:id', verifyToken, verifyModerator, applicationController.addFeedback);

module.exports = router;
