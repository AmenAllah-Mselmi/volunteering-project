const express = require('express');
const router = express.Router();
const {
  authAdmin,
  getAdminProfile,
  createAdmin,
} = require('../controllers/admin.controller');
const { protect, superAdmin } = require('../middlewares/auth');

router.post('/login', authAdmin);
router.route('/profile').get( getAdminProfile);
router.route('/').post( createAdmin);

module.exports = router;