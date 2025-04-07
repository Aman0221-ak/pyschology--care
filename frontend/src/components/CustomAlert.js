import React from "react";
import "./CustomAlert.css";

const CustomAlert = ({ type, message, onClose }) => {
  return (
    <div className={`custom-alert-container custom-alert-${type}`}>
      {message}
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

export default CustomAlert;
