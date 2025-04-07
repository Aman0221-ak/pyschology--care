import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PsychologistDetail.css';

const PsychologistDetail = () => {
  const { id } = useParams();
  const [psychologist, setPsychologist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPsychologist = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/psychologists/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Psychologist not found');
        setPsychologist(data);
      } catch (error) {
        console.error('Error fetching psychologist:', error);
        setPsychologist(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologist();
  }, [id]);

  if (loading) return <div className="loading-message">Loading...</div>;
  if (!psychologist) return <div className="error-message">Psychologist not found.</div>;

  return (
    <div className="psychologist-detail-container">
      <h2>{psychologist.name}</h2>
      <img src={psychologist.image} alt={psychologist.name} className="profile-image" />
      <p><strong>Specialization:</strong> {psychologist.specialization}</p>
      <p><strong>Experience:</strong> {psychologist.experience} years</p>
      <p><strong>Language:</strong> {psychologist.language}</p>
      <p><strong>About:</strong> {psychologist.bio}</p>

      <Link to={`/booking/${psychologist._id}`}>
        <button className="book-btn">Book a Session</button>
      </Link>
    </div>
  );
};

export default PsychologistDetail;
