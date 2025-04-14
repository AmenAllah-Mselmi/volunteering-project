const express = require('express');
const router = express.Router();
const {
  getVolunteers,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  findById
} = require('../controllers/volunteer.controller');


router.route('/')
  .get( getVolunteers)
  .post( createVolunteer);

router.route('/:id')
  .put( updateVolunteer)
  .delete( deleteVolunteer)
  .get(findById);
module.exports = router;