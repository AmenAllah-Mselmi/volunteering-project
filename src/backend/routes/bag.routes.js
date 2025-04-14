const express = require('express');
const router = express.Router();
const {
  createBag,
  getBags,
  getBag,
  updateBag,
  deleteBag,
} = require('../controllers/bag.controller');
// const { protect, admin } = require('../middlewares/auth');

router.route('/')
  .post( createBag)
  .get(getBags);

router.route('/:id')
  .get(getBag)
  .put( updateBag)
  .delete( deleteBag);

module.exports = router;