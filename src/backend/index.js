require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const bagRoutes = require('./routes/bag.routes');
const productRoutes = require('./routes/product.routes');
const distributionRoutes = require('./routes/distribution.routes');
const volunteerRoutes=require('./routes/volunteer.routes');
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à la base de données
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connecté à MongoDB');
})
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bags', bagRoutes);
app.use('/api/products', productRoutes);
app.use('/api/distributions', distributionRoutes);
app.use('/api/volunteers', volunteerRoutes);
// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Quelque chose a mal tourné!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});