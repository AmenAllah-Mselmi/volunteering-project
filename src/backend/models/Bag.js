const mongoose = require('mongoose');

const bagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez ajouter un nom pour le sac'],
    unique: true,
  },
  description: {
    type: String,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [0, 'La quantité ne peut pas être négative'],
      },
    },
  ],
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

module.exports = mongoose.model('Bag', bagSchema);