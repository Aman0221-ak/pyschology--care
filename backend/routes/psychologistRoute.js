const express = require("express");
const router = express.Router();
const Psychologist = require("../models/Psychologist");

// Fetch all psychologists
router.get("/", async (req, res) => {
  try {
    const psychologists = await Psychologist.find();
    res.json(psychologists);
  } catch (err) {
    console.error("Error fetching psychologists:", err);
    res.status(500).json({ message: "Failed to fetch psychologists" });
  }
});

module.exports = router;
