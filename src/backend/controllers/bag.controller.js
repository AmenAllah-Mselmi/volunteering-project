const Bag = require('../models/Bag');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const Distribution=require("../models/Distribution")
// @desc    Créer un nouveau sac
// @route   POST /api/bags
// @access  Admin
exports.createBag = asyncHandler(async (req, res) => {
  const { name, description, products, totalQuantity } = req.body;

  // Vérifier que tous les produits existent et ont suffisamment de quantité
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(400);
      throw new Error(`Produit ${item.product} non trouvé`);
    }
    
    const totalNeeded = item.quantity * totalQuantity;
    if (product.quantity < totalNeeded) {
      res.status(400);
      throw new Error(`Quantité insuffisante pour le produit ${product.name}. Disponible: ${product.quantity}, Nécessaire: ${totalNeeded}`);
    }
  }

  const bag = await Bag.create({
    name,
    description,
    products,
    totalQuantity,
  });

  res.status(201).json(bag);
});

// @desc    Obtenir tous les sacs
// @route   GET /api/bags
// @access  Public
exports.getBags = asyncHandler(async (req, res) => {
  const bags = await Bag.find().populate('products.product', 'name unit');
  res.json(bags);
});

// @desc    Obtenir un sac par ID
// @route   GET /api/bags/:id
// @access  Public
exports.getBag = asyncHandler(async (req, res) => {
  const bag = await Bag.findById(req.params.id).populate('products.product', 'name unit');

  if (!bag) {
    res.status(404);
    throw new Error('Sac non trouvé');
  }

  res.json(bag);
});

// @desc    Mettre à jour un sac
// @route   PUT /api/bags/:id
// @access  Admin
exports.updateBag = asyncHandler(async (req, res) => {
  const { name, description, products, totalQuantity } = req.body;

  const bag = await Bag.findById(req.params.id);

  if (!bag) {
    res.status(404);
    throw new Error('Sac non trouvé');
  }

  // Vérifier les produits et quantités
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(400);
      throw new Error(`Produit ${item.product} non trouvé`);
    }
    
    const totalNeeded = item.quantity * totalQuantity;
    if (product.quantity < totalNeeded) {
      res.status(400);
      throw new Error(`Quantité insuffisante pour le produit ${product.name}`);
    }
  }

  bag.name = name || bag.name;
  bag.description = description || bag.description;
  bag.products = products || bag.products;
  bag.totalQuantity = totalQuantity || bag.totalQuantity;
  bag.remainingQuantity = totalQuantity || bag.remainingQuantity;

  const updatedBag = await bag.save();
  res.json(updatedBag);
});

// @desc    Supprimer un sac
// @route   DELETE /api/bags/:id
// @access  Admin
exports.deleteBag = asyncHandler(async (req, res) => {
  const bag = await Bag.findById(req.params.id);

  if (!bag) {
    res.status(404);
    throw new Error('Sac non trouvé');
  }

  // Vérifier si le sac a été distribué
  const distributions = await Distribution.countDocuments({ bag: bag._id });
  if (distributions > 0) {
    res.status(400);
    throw new Error('Impossible de supprimer un sac qui a été distribué');
  }

  await bag.deleteOne();
  res.json({ message: 'Sac supprimé' });
});