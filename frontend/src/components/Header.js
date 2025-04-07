import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Header.css';

const Header = () => {
  const { user, token, logout } = useAuth(); 
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHoverTimeout, setMenuHoverTimeout] = useState(null);
  const [showBookPopup, setShowBookPopup] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout); // Cancel any pending hide
    setShowBookPopup(true);
  };
  
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setShowBookPopup(false), 300); // Delay fade by 300ms
    setHoverTimeout(timeout);
  };

  const handleMenuMouseEnter = () => {
    if (menuHoverTimeout) clearTimeout(menuHoverTimeout);
    setMenuOpen(true);
  };
  
  const handleMenuMouseLeave = () => {
    const timeout = setTimeout(() => setMenuOpen(false), 300);
    setMenuHoverTimeout(timeout);
  };
  
  const handleDropdownLinkClick = () => {
    setMenuOpen(false); // close menu on link click
  };

  useEffect(() => {
    if (user && token) {}
  }, [user, token]);

  return (
    <header className="header">
      <Link to="/" className="logo">PsychCare</Link>
    
      <div className="nav-links">
        <Link to="/psychologists">Psychologists</Link>
        <Link to="/services">Services</Link> 
        <Link to="/resourcepage">Resources</Link> 
        <Link to="/contact">Contact</Link> 
        <Link to="/aboutus">About</Link>
      </div>
    
      <div className="right-section">
        {user ? (
          <>
            <span className="welcome-text">Welcome, {user.name}</span>

           <div
  className="menu-hover-area"
  onMouseEnter={handleMenuMouseEnter}
  onMouseLeave={handleMenuMouseLeave}
>
  <button className="menu-icon">☰</button>
  {menuOpen && (
    <ul className="dropdown-menu">
      <li><Link to="/profile" onClick={handleDropdownLinkClick}>Profile</Link></li>
      <li><Link to="/psychologists" onClick={handleDropdownLinkClick}>Psychologists</Link></li>
      <li><Link to="/services" onClick={handleDropdownLinkClick}>Services</Link></li>
      <li><Link to="/resourcepage" onClick={handleDropdownLinkClick}>Resources</Link></li>
      <li
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ position: "relative" }}
      >
        <Link to="/" onClick={handleDropdownLinkClick}>BookSession</Link>
        {showBookPopup && (
          <div className="book-popup book-popup-left">
            <p className="quote">"Your mental health is a priority, not a luxury."</p>
            <Link to="/services" className="book-now-popup-btn" onClick={handleDropdownLinkClick}>
              Book Your Session
            </Link>
          </div>
        )}
      </li>
      <li><Link to="/orders" onClick={handleDropdownLinkClick}>My Bookings</Link></li>
      <li><Link to="/contact" onClick={handleDropdownLinkClick}>Contact</Link></li>
      <li><button onClick={() => { logout(); setMenuOpen(false); }} className="logout-btn">Logout</button></li>
    </ul>
  )}
</div>
          </>
        ) : (
          <div className="auth-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </header>  
  );
};

export default Header;
