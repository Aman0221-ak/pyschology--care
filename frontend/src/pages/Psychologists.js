import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Psychologists.css";

const Psychologists = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredPsychologist, setHoveredPsychologist] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const popupTimeoutRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isChoosingConsultant = location.state?.fromServiceDetail || false;

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/psychologists");
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to load");
        setPsychologists(data);
      } catch (error) {
        console.error("Error fetching psychologists:", error);
        setPsychologists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologists();
  }, []);

  const handleSelectConsultant = (psychologist) => {
    const serviceId = location.state?.serviceId;
    if (isChoosingConsultant && serviceId) {
      navigate(`/servicedetail/${serviceId}`, {
        state: {
          selectedPsychologist: psychologist,
        },
      });
    }
  };

  const handleChooseServiceFirst = (psychologist) => {
    navigate("/services", {
      state: {
        selectedPsychologist: psychologist,
      },
    });
  };

  const handleMouseEnter = (psych, e) => {
    if (isChoosingConsultant) return;

    clearTimeout(popupTimeoutRef.current);
    const cardRect = e.currentTarget.getBoundingClientRect();
    const popupWidth = 360;
    const popupHeight = 280;
    const screenWidth = window.innerWidth;

    let left = cardRect.left + cardRect.width * 0.45; 
    let top = cardRect.top + window.scrollY - popupHeight / 0.85 + cardRect.height / 2;

    if (left + popupWidth > screenWidth) {
      left = screenWidth - popupWidth - 10;
    } else if (left < 0) {
      left = 10;
    }

    setHoveredPsychologist(psych);
    setPopupPosition({ x: window.innerWidth - 640, y: top });

  };

  const handleMouseLeave = () => {
    popupTimeoutRef.current = setTimeout(() => {
      setHoveredPsychologist(null);
    }, 200);
  };

  return (
    <div className="psychologists-container">
      <h2>Available Psychologists</h2>
      {loading ? (
        <p>Loading psychologists...</p>
      ) : (
        <div className="psychologist-grid">
          {psychologists.map((psych) => (
            <div
              className="psychologist-card"
              key={psych._id}
              onMouseEnter={(e) => handleMouseEnter(psych, e)}
              onMouseLeave={handleMouseLeave}
            >
              <img src={psych.image} alt={psych.name} />
              <h3>{psych.name}</h3>
              <p>{psych.specialization}</p>
              <p>Experience: {psych.experience} years</p>
              <p>Language: {psych.language}</p>
              <p>Price: ₹{psych.price}</p>

              {isChoosingConsultant ? (
                <button onClick={() => handleSelectConsultant(psych)} className="book-btn">
                  Select Psychologist
                </button>
              ) : (
                <button onClick={() => handleChooseServiceFirst(psych)} className="book-btn">
                  Book Session
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!isChoosingConsultant && hoveredPsychologist && (
        <div
          className="psychologist-popup"
          style={{
            top: popupPosition.y,
            left: popupPosition.x,
            position: "absolute",
            zIndex: 1000,
          }}
          onMouseEnter={() => clearTimeout(popupTimeoutRef.current)}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={hoveredPsychologist.image}
            alt={hoveredPsychologist.name}
            className="popup-image"
          />
          <div className="popup-content">
            <h3>{hoveredPsychologist.name}</h3>
            <p><strong>Specialization:</strong> {hoveredPsychologist.specialization}</p>
            <p><strong>Experience:</strong> {hoveredPsychologist.experience} years</p>
            <p><strong>Language:</strong> {hoveredPsychologist.language}</p>
            <p><strong>Price:</strong> {hoveredPsychologist.price}</p>
            <p className="popup-description">{hoveredPsychologist.hoverPsyDescription}</p>
            <button className="popup-book-btn" onClick={() => handleChooseServiceFirst(hoveredPsychologist)}>
              Book Session</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Psychologists;
