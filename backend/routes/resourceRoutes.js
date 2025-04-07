const express = require('express');
const Book = require('../models/Book');
const SurveyResponse = require('../models/SurveyResponse');
const router = express.Router();

// GET books
router.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});


// POST survey response
router.post('/api/survey', async (req, res) => {
  try {
    const newResponse = new SurveyResponse(req.body);
    await newResponse.save();
    res.status(201).json({ message: 'Survey submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Survey submission failed' });
  }
});

module.exports = router;