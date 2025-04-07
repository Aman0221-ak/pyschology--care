const express = require('express');
const router = express.Router();
const ContactInfo = require('../models/ContactInfo'); // Import the model

// GET contact info from DB
router.get('/', async (req, res) => {
  try {
    const contact = await ContactInfo.findOne(); 
    if (contact) {
      res.json({
        phone: contact.phone,
        email: contact.email
      });
    } else {
      res.status(404).json({ message: 'Contact info not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
