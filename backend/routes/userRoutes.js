const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const checkRole = require('../middleware/roleMiddleware');

// Protected Routes
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

// Admin Routes
router.get('/', authMiddleware, checkRole(['ADMIN']), userController.getAllUsers);
router.delete('/:id', authMiddleware, checkRole(['ADMIN']), userController.deleteUser);

module.exports = router;
