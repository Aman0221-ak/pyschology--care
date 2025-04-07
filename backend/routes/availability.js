const express = require("express");
const router = express.Router();
const Availability = require("../models/Availability");

router.get("/:psychologistId", async (req, res) => {
  const { psychologistId } = req.params;
  const { date } = req.query;

  try {
    const record = await Availability.findOne({
      psychologistId,
      date,
    });

    res.json({
      unavailableSlots: record ? record.unavailableTimes : [],
    });
  } catch (err) {
    console.error("Error fetching availability:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
