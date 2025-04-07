const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Availability = require("../models/Availability");
const { isAuthenticated } = require("../middlewares/authMiddleware"); 

// GET bookings for logged-in user
router.get("/my-bookings", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ userId })
      .populate("psychologistId", "name image specialization")
      .populate("serviceId", "title imageUrl description")
      .sort({ date: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// DELETE booking
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Optional: free up time slot in Availability
    await Availability.findOneAndUpdate(
      { psychologistId: booking.psychologistId, date: booking.date },
      { $pull: { unavailableTimes: booking.time } }
    );

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});

// 🔐 Protected booking route
router.post("/", isAuthenticated, async (req, res) => {
  const { psychologistId, serviceId, date, time, sessionMode, meetingLink } = req.body;
  const userId = req.user._id;

  if (!["Online", "Offline"].includes(sessionMode)) {
    return res.status(400).json({ message: "Invalid session mode" });
  }

  if (sessionMode === "Online" && !meetingLink) {
    return res.status(400).json({ message: "Meeting link is required for online sessions" });
  }

  try {
    // ✅ Check for existing booking with same details
    const existingBooking = await Booking.findOne({
      psychologistId,
      userId,
      serviceId,
      date,
      time
    });

    if (existingBooking) {
      return res.status(409).json({ message: "You have already booked this session. Please select a different time." });
    }

    const newBooking = new Booking({
      psychologistId,
      userId,
      serviceId,
      date,
      time,
      sessionMode,
      meetingLink: sessionMode === "Online" ? meetingLink : null,
      location: sessionMode === "Offline" ? "Clinic - 2nd Floor, XYZ Complex, Pune" : null,
    });

    await newBooking.save();

    await Availability.findOneAndUpdate(
      { psychologistId, date },
      { $addToSet: { unavailableTimes: time } },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    console.error("Error saving booking:", error.message, error.stack);

    // ✅ Friendly message for duplicate key violation (index-level)
    if (error.code === 11000) {
      return res.status(409).json({ message: "This session is already booked." });
    }

    res.status(500).json({ message: "Booking failed" });
  }
});


// PATCH /api/bookings/:id/reschedule
router.patch("/:id/reschedule", isAuthenticated, async (req, res) => {
  const { date, time } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Optional: Free the old time slot
    await Availability.findOneAndUpdate(
      { psychologistId: booking.psychologistId, date: booking.date },
      { $pull: { unavailableTimes: booking.time } }
    );

    // Block the new time slot
    await Availability.findOneAndUpdate(
      { psychologistId: booking.psychologistId, date },
      { $addToSet: { unavailableTimes: time } },
      { upsert: true }
    );

    booking.date = date;
    booking.time = time;
    await booking.save();

    res.status(200).json({ message: "Booking rescheduled successfully", booking });
  } catch (err) {
    console.error("Rescheduling Error:", err);
    res.status(500).json({ message: "Error rescheduling booking" });
  }
});


module.exports = router;
