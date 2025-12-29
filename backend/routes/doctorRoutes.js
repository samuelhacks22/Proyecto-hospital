const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');

const checkRole = require('../middleware/roleMiddleware');

// Protected (Doctor only ideally, maybe Admin too)
router.get('/me', authMiddleware, checkRole(['MEDICO', 'ADMIN']), doctorController.getMyProfile);
router.put('/profile', authMiddleware, checkRole(['MEDICO', 'ADMIN']), doctorController.updateProfile);
router.get('/availability', authMiddleware, checkRole(['MEDICO', 'ADMIN']), doctorController.getAvailability);
router.put('/availability', authMiddleware, checkRole(['MEDICO', 'ADMIN']), doctorController.setAvailability);

// Public (for Patients to find doctors)
router.get('/', doctorController.getAllDoctors);
router.get('/:id/availability', doctorController.getPublicAvailability);

module.exports = router;
