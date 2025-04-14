const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez ajouter un nom de produit'],
    unique: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Veuillez ajouter une quantité'],
    min: [0, 'La quantité ne peut pas être négative'],
  },
  unit: {
    type: String,
    required: [true, 'Veuillez ajouter une unité (kg, g, L, etc.)'],
  },
  totalQuantity: {
    type: Number,
    required: true,
    min: [0, 'La quantité totale ne peut pas être négative'],
  },
  remainingQuantity: {
    type: Number,
    default: function () {
      return this.totalQuantity;
    },
    min: [0, 'La quantité restante ne peut pas être négative'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);