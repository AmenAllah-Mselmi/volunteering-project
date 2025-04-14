const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const asyncHandler = require('express-async-handler');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Non autorisé, token manquant');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    console.error(error);
    res.status(401);
    throw new Error('Non autorisé, token invalide');
  }
});

exports.superAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === 'super-admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Accès réservé aux super administrateurs');
  }
};