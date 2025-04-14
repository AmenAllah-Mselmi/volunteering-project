const Admin = require('../models/Admin');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');

// @desc    Authenticate admin & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Vérifier si l'admin existe
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    res.status(401);
    throw new Error('Identifiants invalides');
  }

  // Vérifier le mot de passe
  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Identifiants invalides');
  }

  // Générer le token JWT
  const token = generateToken(admin._id);

  res.json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    token
  });
});

// @desc    Get logged in admin profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  if (!admin) {
    res.status(404);
    throw new Error('Admin non trouvé');
  }

  res.json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    createdAt: admin.createdAt
  });
});

// @desc    Update admin profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  if (!admin) {
    res.status(404);
    throw new Error('Admin non trouvé');
  }

  admin.name = req.body.name || admin.name;
  admin.email = req.body.email || admin.email;

  if (req.body.password) {
    admin.password = req.body.password;
  }

  const updatedAdmin = await admin.save();

  res.json({
    _id: updatedAdmin._id,
    name: updatedAdmin.name,
    email: updatedAdmin.email,
    role: updatedAdmin.role,
    token: generateToken(updatedAdmin._id)
  });
});