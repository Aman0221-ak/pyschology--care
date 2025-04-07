import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './BookingPage.css';

const BookingPage = () => {
  const location = useLocation();
  const selectedPsychologist = location.state?.selectedPsychologist;
  const selectedService = location.state?.selectedService;

  const [consultationType, setConsultationType] = useState('Video Call');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const totalPrice = (selectedPsychologist?.price || 0) + (selectedService?.price || 0);

  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM',
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert("Pick a date *and* time, my disorganized friend.");
      return;
    }

    console.log({
      psychologistId: selectedPsychologist?._id,
      serviceId: selectedService?._id,
      consultationType,
      selectedDate,
      selectedTime,
      totalPrice,
    });

    alert(`Booking confirmed for ₹${totalPrice} on ${selectedDate} at ${selectedTime} via ${consultationType}`);
  };

  return (
    <div className="booking-container">
      <h2>Book Your Session</h2>

      <div className="section">
        <label>Consultation Type:</label>
        <div className="options">
          {['Video Call', 'Audio Call', 'Chat'].map(type => (
            <label key={type}>
              <input
                type="radio"
                name="consultationType"
                value={type}
                checked={consultationType === type}
                onChange={() => setConsultationType(type)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="section">
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="section">
        <label>Select Time Slot:</label>
        <div className="options">
          {timeSlots.map(slot => (
            <button
              key={slot}
              className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
              onClick={() => setSelectedTime(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <div className="price-summary">
        <h3>Total Price: ₹{totalPrice}</h3>
        <p>Psychologist Fee: ₹{selectedPsychologist?.price}</p>
        <p>Service Fee: ₹{selectedService?.price}</p>
      </div>

      <button className="book-now-btn" onClick={handleBooking}>Book Now</button>
    </div>
  );
};

export default BookingPage;
