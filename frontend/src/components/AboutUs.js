import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About Us</h1>
        <p>
          Empowering mental wellness through compassion, technology, and connection.
        </p>
      </div>

      <div className="about-section">
        <h2>Who We Are</h2>
        <p>
          We are a dedicated psychological consultancy committed to providing accessible, personalized mental health support through certified professionals. From one-on-one counseling sessions to online therapy and resourceful tools, we focus on your emotional and psychological well-being at every step.
        </p>
      </div>

      <div className="about-section">
        <h2>What We Offer</h2>
        <div className="about-card-container">
          <div className="about-card">
            <h3>Explore Our Services</h3>
            <p>Discover a wide range of mental wellness services tailored to your needs.</p>
            <button onClick={() => navigate("/services")} className="about-btn">
              Go to Services
            </button>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Our Team</h2>
        <div className="about-card-container">
          <div className="about-card">
            <h3>Meet Our Psychologists</h3>
            <p>Learn more about our certified and compassionate mental health experts.</p>
            <button onClick={() => navigate("/psychologists")} className="about-btn">
              Go to Psychologists
            </button>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Join Our Journey</h2>
        <p>
          Whether you're seeking support, exploring self-help resources, or just curious to learn more — we welcome you to connect with us. Let’s take a step toward a healthier mind, together.
        </p>
        <button className="about-contact-btn" onClick={() => window.location.href = "/contact"}>
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default AboutUs;
