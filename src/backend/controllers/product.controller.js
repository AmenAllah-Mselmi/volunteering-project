const Product = require('../models/Product');
const Bag = require('../models/Bag');
const asyncHandler = require('express-async-handler');

// @desc    Create a new product
// @route   POST /api/products
// @access  Admin
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, quantity, unit, totalQuantity } = req.body;

  // Calculate remaining quantity
  const remainingQuantity = totalQuantity || quantity;

  const product = await Product.create({
    name,
    quantity,
    unit,
    totalQuantity: totalQuantity || quantity,
    remainingQuantity
  });

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Produit non trouvé'
    });
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
exports.updateProduct = asyncHandler(async (req, res) => {
  const { name, quantity, unit, totalQuantity } = req.body;

  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Produit non trouvé'
    });
  }

  // Calculate new remaining quantity if totalQuantity is updated
  let remainingQuantity = product.remainingQuantity;
  if (totalQuantity && totalQuantity !== product.totalQuantity) {
    const difference = totalQuantity - product.totalQuantity;
    remainingQuantity = product.remainingQuantity + difference;
    
    if (remainingQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'La nouvelle quantité totale rendrait la quantité restante négative'
      });
    }
  }

  product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: name || product.name,
      quantity: quantity || product.quantity,
      unit: unit || product.unit,
      totalQuantity: totalQuantity || product.totalQuantity,
      remainingQuantity
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Produit non trouvé'
    });
  }

  // Check if product is used in any bags
  const bags = await Bag.find({ 'products.product': product._id });
  if (bags.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Impossible de supprimer un produit utilisé dans des sacs'
    });
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update product quantity
// @route   PATCH /api/products/:id/quantity
// @access  Admin
exports.updateProductQuantity = asyncHandler(async (req, res) => {
  const { action, amount } = req.body;

  if (!['add', 'remove'].includes(action) || !amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Action invalide ou montant incorrect'
    });
  }

  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Produit non trouvé'
    });
  }

  if (action === 'add') {
    product.quantity += amount;
    product.totalQuantity += amount;
    product.remainingQuantity += amount;
  } else {
    if (product.quantity < amount) {
      return res.status(400).json({
        success: false,
        message: 'Quantité insuffisante'
      });
    }
    product.quantity -= amount;
    product.remainingQuantity -= amount;
  }

  await product.save();

  res.status(200).json({
    success: true,
    data: product
  });
});