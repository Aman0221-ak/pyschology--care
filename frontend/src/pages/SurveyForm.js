import React, { useState } from "react";
import axios from "axios";
import "./SurveyForm.css"; // Create this file for styling if needed

const SurveyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    strengths: "",
    weaknesses: "",
    goals: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post("http://localhost:8000/api/survey/submit", formData);
      alert("Survey submitted successfully!");
    } catch (error) {
      console.error("Survey submission failed:", error);
      alert("Failed to submit survey.");
    }
  };

  return (
    <div className="survey-form-container">
      <h2>Psychological Assessment Form</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Your Name" required onChange={handleChange} />
        <input type="number" name="age" placeholder="Your Age" required onChange={handleChange} />
        <textarea name="strengths" placeholder="Your Strengths" required onChange={handleChange} />
        <textarea name="weaknesses" placeholder="Your Weaknesses" required onChange={handleChange} />
        <textarea name="goals" placeholder="Your Personal Goals" required onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SurveyForm;