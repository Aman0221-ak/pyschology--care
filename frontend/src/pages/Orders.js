import React, { useEffect, useState } from "react";
import "./Orders.css";

const Orders = () => {
  const [bookings, setBookings] = useState([]);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const allTimeSlots = ["10:00 AM", "12:00 PM", "03:00 PM", "06:00 PM"];
  const [selectedPsychologistId, setSelectedPsychologistId] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/bookings/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }finally {
      setLoading(false); 
    }
  };

  const handleCancel = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Booking cancelled.");
        fetchBookings(); 
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel booking.");
    }
  };

  const handleReschedule = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8000/api/bookings/${rescheduleId}/reschedule`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: newDate, time: newTime }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Booking rescheduled!");
        setShowModal(false);
        setNewDate("");
        setNewTime("");
        setRescheduleId(null);
        setUnavailableSlots([]);
        fetchBookings();
      } else {
        alert(`Failed to reschedule: ${data.message}`);
      }
    } catch (err) {
      console.error("Reschedule error:", err);
      alert("Error while rescheduling.");
    }
  };

  const fetchUnavailableSlots = async (psychologistId, date) => {
    if (!date || !psychologistId) return;
    try {
      const res = await fetch(`http://localhost:8000/api/availability/${psychologistId}?date=${date}`);
      const data = await res.json();
      setUnavailableSlots(data.unavailableSlots || []);
    } catch (err) {
      console.error("Error fetching unavailable slots:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (newDate && selectedPsychologistId) {
      fetchUnavailableSlots(selectedPsychologistId, newDate);
    }
  }, [newDate, selectedPsychologistId]);

          return (
            <div className="orders-container">
              <h2>Your Bookings</h2>
                  {loading ? (
              <div className="spinner"></div>
            ) : bookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              bookings.map((b) => (

          <div key={b._id} className="booking-card">
            <img src={b.psychologistId.image} alt={b.psychologistId.name} />
            <div className="booking-details">
              <h3>{b.psychologistId.name}</h3>
              <p><strong>Service:</strong> {b.serviceId.title}</p>
              <p><strong>Session Mode:</strong> {b.sessionMode}</p>
              {b.sessionMode === "Online" && (
                <p><strong>Meeting Link:</strong>{" "}
                <a href={b.meetingLink} target="_blank" rel="noopener noreferrer" className="join-button">
                Join Now</a></p>)}{b.sessionMode === "Offline" && (
                <p><strong>Clinic Address:</strong>{" "}
                 {b.location || "2nd Floor, XYZ Complex, Pune"}
                </p>
                 )}
              <p><strong>Date:</strong> {b.date}</p>
              <p><strong>Time:</strong> {b.time}</p>
              <p><strong>Status:</strong> Confirmed</p>
              <button className="cancel-btn" onClick={() => handleCancel(b._id)}>
                Cancel Booking
              </button>
              <button className="reschedule-btn" onClick={() => {
                setRescheduleId(b._id);
                setSelectedPsychologistId(b.psychologistId._id);
                setShowModal(true);
              }}>
                ✏️ Reschedule
              </button>
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div className="reschedule-modal">
          <h3>Reschedule Booking</h3>
          <label>New Date:</label>
          <input type="date" value={newDate} onChange={(e) => {
            setNewDate(e.target.value);
            setNewTime("");
          }} />
          <label>New Time:</label>
          <select value={newTime} onChange={(e) => setNewTime(e.target.value)}>
            <option value="">--Select Time--</option>
            {allTimeSlots.map((slot) => (
              <option key={slot} value={slot} disabled={unavailableSlots.includes(slot)}>
                {slot} {unavailableSlots.includes(slot) ? "(Unavailable)" : ""}
              </option>
            ))}
          </select>
          <div className="modal-btns">
            <button onClick={handleReschedule}>Confirm</button>
            <button onClick={() => {
              setShowModal(false);
              setNewDate("");
              setNewTime("");
              setRescheduleId(null);
              setUnavailableSlots([]);
            }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
