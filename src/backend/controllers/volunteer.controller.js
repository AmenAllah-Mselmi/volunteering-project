const Volunteer = require('../models/Volunteer');
const asyncHandler = require('express-async-handler');

// @desc    Get all volunteers
// @route   GET /api/volunteers
// @access  Private/Admin
exports.getVolunteers = asyncHandler(async (req, res) => {
  const volunteers = await Volunteer.find().populate('region');
  res.json(volunteers);
});

// @desc    Create new volunteer
// @route   POST /api/volunteers
// @access  Private/Admin
exports.createVolunteer = asyncHandler(async (req, res) => {
  const { name, email, Tel, region } = req.body;

  const volunteerExists = await Volunteer.findOne({ email });

  if (volunteerExists) {
    res.status(400);
    throw new Error('Un volontaire avec cet email existe déjà');
  }

  const volunteer = await Volunteer.create({
    name,
    email,
    Tel,
    region,
  });

  res.status(201).json(volunteer);
});
exports.findById=asyncHandler(async(req,res)=>{
  const volunteer = await Volunteer.findById(req.params.id).populate('region');
  if (!volunteer) {
    res.status(404);
    throw new Error('Volontaire non défini');
  }
  res.json(volunteer);
})
// @desc    Update volunteer
// @route   PUT /api/volunteers/:id
// @access  Private/Admin
exports.updateVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('region');

  if (!volunteer) {
    res.status(404);
    throw new Error('Volontaire non trouvé');
  }

  res.json(volunteer);
});

// @desc    Delete volunteer
// @route   DELETE /api/volunteers/:id
// @access  Private/Admin
exports.deleteVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

  if (!volunteer) {
    res.status(404);
    throw new Error('Volontaire non trouvé');
  }

  res.json({ message: 'Volontaire supprimé avec succès' });
});