import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./ServiceDetail.css";

const ServiceDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/services/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Service not found");
        setService(data);
      } catch (error) {
        console.error("Error fetching service:", error);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [id]);

  useEffect(() => {
    if (location.state?.selectedPsychologist) {
      setSelectedPsychologist(location.state.selectedPsychologist);
    }
  }, [location.state]);

  const handleChooseConsultant = () => {
    navigate("/psychologists", { state: { fromServiceDetail: true, serviceId: id } });
  };

  const handleStartSession = () => {
    if (!selectedPsychologist) {
      alert("Please choose a psychologist first!");
      return;
    }
    navigate("/booksession", {
      state: {
        selectedPsychologist,
        selectedService: service,
      },
    });
  };

  const handleRemovePsychologist = () => {
    setSelectedPsychologist(null);
  };

  if (loading) return <p className="loading-message">Loading service details...</p>;
  if (!service) return <p className="error-message">Service not found.</p>;

  return (
    <div className="service-detail-container">
      <div className="service-info-card">
        <img src={service.imageUrl} alt={service.title} className="service-image" />
        <h1 className="service-title">{service.title}</h1>
        <p className="service-description">{service.description}</p>
        <p className="service-price">Service Price: ₹{service.price}</p>
      </div>

      <div className="service-perks-card">
        <h2>Perks of This Service</h2>
        <ul>
          {service.perks && service.perks.length > 0 ? (
            service.perks.map((perk, index) => <li key={index}>{perk}</li>)
          ) : (
            <li>No perks available</li>
          )}
        </ul>

        {!selectedPsychologist ? (
          <button className="choose-consultant-btn" onClick={handleChooseConsultant}>
            Choose Your Psychologist
          </button>
        ) : (
          <div className="selected-psychologist-card">
            <button
              className="remove-psychologist-btn"
              onClick={handleRemovePsychologist}
              title="Remove Psychologist"
            >
              ❌
            </button>
            <img src={selectedPsychologist.image} alt={selectedPsychologist.name} />
            <h3>{selectedPsychologist.name}</h3>
            <p><strong>Specialization:</strong> {selectedPsychologist.specialization}</p>
            <p><strong>Experience:</strong> {selectedPsychologist.experience} years</p>
            <p><strong>Language:</strong> {selectedPsychologist.language}</p>
            <p><strong>Psychologist Fee:</strong> ₹{selectedPsychologist.price}</p>
            <p><strong>Service Fee:</strong> ₹{service.price}</p>
            <p className="total-session-price">
              <strong>Total Session Price:</strong> ₹{selectedPsychologist.combinedPrice ?? (selectedPsychologist.price + service.price)}</p>


            <button className="start-session-btn" onClick={handleStartSession}>
              Book Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;
