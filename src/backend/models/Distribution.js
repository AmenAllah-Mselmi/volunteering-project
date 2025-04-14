const mongoose = require('mongoose');

const distributionSchema = new mongoose.Schema({
  bag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bag',
    required: true,
  },
  region: {
    type:String,
    required: true,
  },
  quantityDistributed: {
    type: Number,
    required: true,
    min: [1, 'Vous devez distribuer au moins un sac'],
  },
  distributedTo: {
    type:String,
    required: true,
  },
  distributionDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
});

// Middleware pour mettre à jour les quantités restantes
distributionSchema.pre('save', async function (next) {
  const bag = await this.model('Bag').findById(this.bag);
  
  if (bag.remainingQuantity < this.quantityDistributed) {
    throw new Error('Quantité disponible insuffisante');
  }
  
  // Mettre à jour les produits dans le sac
  for (const item of bag.products) {
    const product = await this.model('Product').findById(item.product);
    const totalQuantityUsed = item.quantity * this.quantityDistributed;
    
    if (product.quantity < totalQuantityUsed) {
      throw new Error(`Quantité insuffisante pour le produit ${product.name}`);
    }
    
    product.quantity -= totalQuantityUsed;
    await product.save();
  }
  
  // Mettre à jour les sacs restants
  bag.remainingQuantity -= this.quantityDistributed;
  await bag.save();
  
  next();
});

module.exports = mongoose.model('Distribution', distributionSchema);