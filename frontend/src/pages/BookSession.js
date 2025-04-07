import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CustomAlert from "../components/CustomAlert";
import "./BookSession.css";

const BookSession = () => {
  const location = useLocation();
  const selectedPsychologist = location.state?.selectedPsychologist;
  const selectedService = location.state?.selectedService;
  const [sessionMode, setSessionMode] = useState("Online");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const allTimeSlots = ["10:00 AM", "12:00 PM", "03:00 PM", "06:00 PM"];

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  // 💰 Calculate total price
  const totalPrice = (selectedPsychologist?.price || 0) + (selectedService?.price || 0);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate || !selectedPsychologist) return;

      try {
        const response = await fetch(
          `http://localhost:8000/api/availability/${selectedPsychologist._id}?date=${selectedDate}`
        );
        const data = await response.json();
        setUnavailableSlots(data.unavailableSlots || []);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [selectedDate, selectedPsychologist]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      setAlertType("error");
      setAlertMessage("Please select date and time for the session.");
      setTimeout(() => setAlertMessage(""), 4000);
      return;
    }

    const token = localStorage.getItem("token");

    const bookingDetails = {
      psychologistId: selectedPsychologist._id,
      serviceId: selectedService._id,
      date: selectedDate,
      time: selectedTime,
      sessionMode,
    };

    try {
      const res = await fetch("http://localhost:8000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingDetails),
      });

      const data = await res.json();

      if (res.ok) {
        setAlertType("success");
        setAlertMessage("Booking Confirmed!");
        setSelectedDate("");
        setSelectedTime("");
      } else {
        setAlertType("error");
        setAlertMessage(`Booking Failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Booking Error:", err);
      setAlertType("error");
      setAlertMessage("Something went wrong while booking. Try again.");
    }

    setTimeout(() => setAlertMessage(""), 4000);
  };

  return (
    <div className="book-session-container">
      <h2>Book Your Session</h2>

      {/* ✅ Alert */}
      {alertMessage && (
        <CustomAlert
          type={alertType}
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />
      )}

      {selectedPsychologist && (
        <div className="preview-card">
          <img src={selectedPsychologist.image} alt={selectedPsychologist.name} />
          <div className="preview-details">
            <h3>{selectedPsychologist.name}</h3>
            <p><strong>Specialization:</strong> {selectedPsychologist.specialization}</p>
            <p><strong>Experience:</strong> {selectedPsychologist.experience} years</p>
            <p><strong>Languages:</strong> {selectedPsychologist.language}</p>
            <p><strong>Price:</strong> ₹{selectedPsychologist.price}</p>
          </div>
        </div>
      )}

      {selectedService && (
        <div className="preview-card">
          <img src={selectedService.imageUrl} alt={selectedService.title} />
          <div className="preview-details">
            <h3>{selectedService.title}</h3>
            <p>{selectedService.description}</p>
            <p><strong>Service Price:</strong> ₹{selectedService.price}</p>
          </div>
        </div>
      )}

      {/* ✅ Total price below both cards */}
      <div className="total-price-card">
        <h3>Total Session Price: ₹{totalPrice}</h3>
      </div>

      <div className="booking-section">
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedTime("");
          }}
        />

        <label>Select Time:</label>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="">-- Select Time Slot --</option>
          {allTimeSlots.map((slot) => (
            <option
              key={slot}
              value={slot}
              disabled={unavailableSlots.includes(slot)}
            >
              {slot} {unavailableSlots.includes(slot) ? "(Unavailable)" : ""}
            </option>
          ))}
        </select>

        <label>Session Mode:</label>
        <select
          value={sessionMode}
          onChange={(e) => setSessionMode(e.target.value)}
        >
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>

        <button className="confirm-btn" onClick={handleBooking}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookSession;
