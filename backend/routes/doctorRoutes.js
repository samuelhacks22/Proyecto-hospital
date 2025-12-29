const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected (Doctor only ideally)
router.get('/me', authMiddleware, doctorController.getMyProfile);
router.put('/profile', authMiddleware, doctorController.updateProfile);
router.get('/availability', authMiddleware, doctorController.getAvailability);
router.put('/availability', authMiddleware, doctorController.setAvailability);

// Public (for Patients to find doctors)
router.get('/', doctorController.getAllDoctors);

module.exports = router;
