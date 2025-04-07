const mongoose = require("mongoose");

const PsychologistSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  experience: Number,
  language: String,
  image: String,
  price: { type: Number },
  combinedPrice: { type: Number }, // For combined services
  sessionModes: [String], // e.g., ["Online", "In-Person", "Phone"]
  address: String,        // For in-person sessions
  videoCallLink: String,  // Optional: preset Zoom/Meet link for online
  phoneNumber: String,
  hoverPsyDescription: String,
});

module.exports = mongoose.model("Psychologist", PsychologistSchema);
