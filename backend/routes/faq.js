const express = require('express');
const router = express.Router();
const Faq = require('../models/Faq'); 

router.get('/', async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
