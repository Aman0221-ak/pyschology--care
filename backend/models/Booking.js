const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  psychologistId: { type: mongoose.Schema.Types.ObjectId, ref: "Psychologist" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  date: String,
  time: String,
  sessionMode: String,
  meetingLink: String,    
  location: String  
});


bookingSchema.index(
  { psychologistId: 1, userId: 1, serviceId: 1, date: 1, time: 1 },
  { unique: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
