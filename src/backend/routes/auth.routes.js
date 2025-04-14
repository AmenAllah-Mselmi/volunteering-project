const express = require('express');
const router = express.Router();
const {
  login,
  getProfile,
  updateProfile
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth');

// Public routes
router.post('/login', login);

// Protected routes
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

module.exports = router;