import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [hoveredService, setHoveredService] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const location = useLocation();
  const navigate = useNavigate();
  const popupTimeoutRef = useRef(null);
  const popupRef = useRef(null);


  const selectedPsychologist = location.state?.selectedPsychologist || null;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = (serviceId) => {
    navigate(`/servicedetail/${serviceId}`, {
      state: {
        selectedPsychologist,
      },
    });
  };

  const handleMouseEnter = async (service, e) => {
    clearTimeout(popupTimeoutRef.current);
  
    const cardRect = e.currentTarget.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
  
    setHoveredService(service); // First, set it to trigger the popup render
  
    // Delay just enough to measure popup
    setTimeout(() => {
      const popupHeight = popupRef.current?.offsetHeight || 240; 
      const popupWidth = popupRef.current?.offsetWidth || 300;
  
      let left = cardRect.left + cardRect.width / 2 - popupWidth / 2 + cardRect.width * 0.44;
  let top = cardRect.top - popupHeight / 2 + cardRect.height / 2;

  if (left + popupWidth > screenWidth) {
    left = screenWidth - popupWidth - 10;
  } else if (left < 0) {
    left = 10;
  }

  if (top + popupHeight > screenHeight) {
    top = screenHeight - popupHeight - 10;
  }
  if (top < 0) {
    top = 10;
  }

  setPopupPosition({ x: left, y: top });
}, 10); // Wait a moment to allow rendering
  };
  

  const handleMouseLeave = () => {
    popupTimeoutRef.current = setTimeout(() => {
      setHoveredService(null);
    }, 200);
  };

  return (
    <div className="services-container">
      <div className="services-intro">
        <h1 className="services-title">Explore Our Mental Wellness Services</h1>
        <p className="services-subtext">
          We're committed to providing expert psychological support tailored to your needs.<br />
          Discover a variety of services designed to promote your emotional well-being.
        </p>
      </div>

      <div className="services-list">
        {services.map(service => (
          <div
            key={service._id}
            className="service-card"
            onClick={() => handleServiceClick(service._id)}
            onMouseEnter={(e) => handleMouseEnter(service, e)}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
          >
            <img src={service.imageUrl} alt={service.title} className="service-image" />
            <div className="service-content">
              <h2 className="service-title">{service.title}</h2>
              <p className="service-description">{service.description}</p>
              <span className="service-link">Learn More →</span>
            </div>
          </div>
        ))}
      </div>

      {hoveredService && (
        <div
          ref={popupRef}
          className="hover-popup"
          style={{
            top: popupPosition.y,
            left: popupPosition.x,
          }}
          onMouseEnter={() => clearTimeout(popupTimeoutRef.current)}
          onMouseLeave={handleMouseLeave}
        >
          <h3>{hoveredService.title}</h3>
          <img src={hoveredService.imageUrl} alt={hoveredService.title} className="popup-image" />
          <p>{hoveredService.hoverDescription}</p>
        </div>
      )}
    </div>
  );
};

export default Services;
