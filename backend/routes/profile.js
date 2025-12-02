const express = require('express');
const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const router = express.Router();

// Create/Update profile
router.post('/', async (req, res) => {
  try {
    const profileData = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId: profileData.userId },
      profileData,
      { upsert: true, new: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get profile
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
