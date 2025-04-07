import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DropdownMenu.css"; // Style it separately

const DropdownMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="dropdown-container">
      {/* Triple-dash button */}
      <button className="menu-btn" onClick={() => setOpen(!open)}>
        ☰
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="dropdown-menu">
          <Link to="/profile">User Profile</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/suggestions">Suggestions</Link>
          <Link to="/payments">Payments</Link>
          <Link to="/settings">Settings</Link>
          <button className="logout-btn">Logout</button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
