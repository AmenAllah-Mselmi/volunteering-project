const express = require('express');
const router = express.Router();
const {
  createDistribution,
  getDistributions,
  getDistributionById,
  updateDistribution,
  deleteDistribution,
  getDistributionStats,
  getDistributionsByRegion,
} = require('../controllers/distribution.controller');
const { protect, admin } = require('../middlewares/auth');

router.route('/')
  .post( createDistribution)
  .get( getDistributions);

router.route('/stats')
  .get( getDistributionStats);

router.route('/region/:regionId')
  .get( getDistributionsByRegion);

router.route('/:id')
  .get( getDistributionById)
  .put(  updateDistribution)
  .delete( deleteDistribution);

module.exports = router;