const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Protected admin routes
router.post('/', productController.createProduct);
router.put('/:id',  productController.updateProduct);
router.delete('/:id',  productController.deleteProduct);
router.patch('/:id/quantity',  productController.updateProductQuantity);

module.exports = router;