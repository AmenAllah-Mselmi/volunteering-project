const Distribution = require('../models/Distribution');
const Bag = require('../models/Bag');
const asyncHandler = require('express-async-handler');

// @desc    Create a distribution
// @route   POST /api/distributions
// @access  Admin/Volunteer
exports.createDistribution = asyncHandler(async (req, res) => {
  const { bagId, region, quantity, notes,distributedTo } = req.body;

  // Validate input quantity
  const quantityNum = Number(quantity);
  if (isNaN(quantityNum) || quantityNum <= 0) {
    res.status(400);
    throw new Error('Please enter a valid positive quantity');
  }

  const bag = await Bag.findById(bagId);
  if (!bag) {
    res.status(404);
    throw new Error('Bag not found');
  }

  // Ensure remainingQuantity is a valid number
  const currentRemaining = Number(bag.remainingQuantity);
  if (isNaN(currentRemaining)) {
    res.status(500);
    throw new Error('Invalid bag quantity data');
  }

  if (currentRemaining < quantityNum) {
    res.status(400);
    throw new Error(`Insufficient quantity available. Remaining: ${currentRemaining}`);
  }

  try {
    // Update bag remaining quantity
    bag.remainingQuantity = currentRemaining - quantityNum;
    await bag.save();

    const distribution = await Distribution.create({
      bag: bagId,
      region,
      quantityDistributed: quantityNum,
      distributedTo: distributedTo,
      notes,
    });

    res.status(201).json(distribution);
  } catch (error) {
    // If something went wrong, revert the bag quantity
    bag.remainingQuantity = currentRemaining;
    await bag.save();
    throw error;
  }
});

// @desc    Get all distributions
// @route   GET /api/distributions
// @access  Admin
exports.getDistributions = asyncHandler(async (req, res) => {
  const distributions = await Distribution.find()
    .populate('bag', 'name')
    .populate('region', 'name code')
    .populate('distributedTo', 'name email');
  
  res.json(distributions);
});

// @desc    Get distribution by ID
// @route   GET /api/distributions/:id
// @access  Private
exports.getDistributionById = asyncHandler(async (req, res) => {
  const distribution = await Distribution.findById(req.params.id)
    .populate('bag', 'name')
    .populate('region', 'name code')
    .populate('distributedTo', 'name email');

  if (!distribution) {
    res.status(404);
    throw new Error('Distribution not found');
  }

  res.json(distribution);
});

// @desc    Update distribution
// @route   PUT /api/distributions/:id
// @access  Admin
exports.updateDistribution = asyncHandler(async (req, res) => {
  const { quantity, notes ,region,distributedTo,bagId} = req.body;
  const distribution = await Distribution.findById(req.params.id);

  if (!distribution) {
    res.status(404);
    throw new Error('Distribution not found');
  }

  // If quantity is being updated
  if (quantity && quantity !== distribution.quantityDistributed) {
    const bag = await Bag.findById(distribution.bag);
    const quantityDifference = quantity - distribution.quantityDistributed;

    if (bag.remainingQuantity + distribution.quantityDistributed < quantity) {
      res.status(400);
      throw new Error(`Insufficient quantity available. Max possible: ${bag.remainingQuantity + distribution.quantityDistributed}`);
    }

    // Update bag remaining quantity
    bag.remainingQuantity -= quantityDifference;
    await bag.save();

    distribution.quantityDistributed = quantity;
  }

  if (notes) distribution.notes = notes;
  if(region) distribution.region = region;
  if(distributedTo) distribution.distributedTo = distributedTo;
  if(bagId) distribution.bag = bagId;
  const updatedDistribution = await distribution.save();
  res.json(updatedDistribution);
});

// @desc    Delete distribution
// @route   DELETE /api/distributions/:id
// @access  Admin
exports.deleteDistribution = asyncHandler(async (req, res) => {
  const distribution = await Distribution.findById(req.params.id);

  if (!distribution) {
    res.status(404);
    throw new Error('Distribution not found');
  }

  // Return quantity to bag
  const bag = await Bag.findById(distribution.bag);
  bag.remainingQuantity += distribution.quantityDistributed;
  await bag.save();

  await distribution.deleteOne();
  res.json({ message: 'Distribution removed' });
});

// @desc    Get distribution statistics
// @route   GET /api/distributions/stats
// @access  Admin
exports.getDistributionStats = asyncHandler(async (req, res) => {
  const stats = await Distribution.aggregate([
    {
      $group: {
        _id: '$region',
        totalBags: { $sum: '$quantityDistributed' },
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'regions',
        localField: '_id',
        foreignField: '_id',
        as: 'region',
      },
    },
    {
      $unwind: '$region',
    },
    {
      $project: {
        regionName: '$region.name',
        regionCode: '$region.code',
        totalBags: 1,
        count: 1,
      },
    },
    {
      $sort: { totalBags: -1 },
    },
  ]);

  const totalBags = stats.reduce((acc, curr) => acc + curr.totalBags, 0);
  const totalDistributions = stats.reduce((acc, curr) => acc + curr.count, 0);

  res.json({
    totalBags,
    totalDistributions,
    byRegion: stats,
  });
});

// @desc    Get distributions by region
// @route   GET /api/distributions/region/:regionId
// @access  Private
exports.getDistributionsByRegion = asyncHandler(async (req, res) => {
  const distributions = await Distribution.find({ region: req.params.regionId })
    .populate('bag', 'name')
    .populate('distributedTo', 'name email');

  res.json(distributions);
});