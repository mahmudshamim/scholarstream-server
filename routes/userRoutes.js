const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyAdmin, verifyModerator } = require('../middlewares/verifyToken');

// Auth (JWT)
router.post('/jwt', userController.createToken);

// Users
router.post('/users', userController.createOrUpdateUser);
router.get('/users', verifyToken, verifyAdmin, userController.getAllUsers);
router.get('/users/:email', verifyToken, userController.getUserByEmail); // to get own profile info + role status
router.get('/users/admin/:email', verifyToken, userController.getAdminStatus); // Helper for hooks
router.get('/users/moderator/:email', verifyToken, userController.getModeratorStatus); // Helper for hooks

router.patch('/users/role/:id', verifyToken, verifyAdmin, userController.updateUserRole);
router.delete('/users/:id', verifyToken, verifyAdmin, userController.deleteUser);

module.exports = router;
