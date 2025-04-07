const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  psychologistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Psychologist",
    required: true,
  },
  date: {
    type: String, // e.g., "2025-04-06"
    required: true,
  },
  unavailableSlots: [String], // e.g., ["10:00 AM", "03:00 PM"]
});

module.exports = mongoose.model("Availability", availabilitySchema);
