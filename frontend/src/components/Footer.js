import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>PsychCare</h3>
          <p>Empowering mental wellness through compassion, technology, and connection.</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/aboutus">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/psychologists">Psychologists</Link></li>
              <li><Link to="/resourcepage">Resources</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 PsychCare. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
