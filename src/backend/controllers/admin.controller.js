const Admin = require('../models/Admin');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');

// @desc    Authenticate admin
// @route   POST /api/admin/login
// @access  Public
exports.authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select('+password');

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error('Email ou mot de passe invalide');
  }
});

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
exports.getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  if (admin) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } else {
    res.status(404);
    throw new Error('Admin non trouvé');
  }
});

// @desc    Create new admin (Super Admin only)
// @route   POST /api/admin
// @access  Private/SuperAdmin
exports.createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    res.status(400);
    throw new Error('Un admin avec cet email existe déjà');
  }

  const admin = await Admin.create({
    name,
    email,
    password,
    role: "admin",
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } else {
    res.status(400);
    throw new Error('Données admin invalides');
  }
});