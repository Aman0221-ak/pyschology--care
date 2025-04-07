import React, { useEffect, useState } from 'react';
import './contact.css';

const Contact = () => {
  const [contact, setContact] = useState({});
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/contact');
        const data = await response.json();
        setContact(data);
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };

    const fetchFaqs = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/faqs');
        const data = await response.json();
        setFaqs(data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchContactInfo();
    fetchFaqs();
  }, []);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="contact-container">
      <div className="contact-hero">
        <h1 className="contact-title">We're Here To Help You!</h1>
        <p className="contact-subtext">
          Our team of certified psychologists is dedicated to your well-being.<br />
          Reach out to us with your questions, concerns, or just to talk.
        </p>
      </div>

      <div className="contact-details">
        <h2 className="contact-anytime">You can raech us anytime.</h2>
        <p className="contact-info"><strong>📞 Call us at:</strong> {contact.phone || 'Loading...'}</p>
        <p className="contact-info"><strong>📧 Email us at:</strong> {contact.email || 'Loading...'}</p>

        <p className="contact-info location-section">
          <strong>📍 Reach us at:</strong> Lovely Professional University, Punjab, India
          <img 
            src="https://cdn-icons-png.flaticon.com/512/684/684908.png" 
            alt="Google Map" 
            className="map-icon"
            onClick={() => setMapModalOpen(true)} 
            />
          </p>
          </div>

      <div className="faq-section">
        <h2 className="faq-title">General Questions</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleAnswer(index)}>
              <span>{faq.question}</span>
              <span className="arrow">{openIndex === index ? '▲' : '▼'}</span>
            </div>
            {openIndex === index && <div className="faq-answer">{faq.answer}</div>}
          </div>
        ))}
      </div>

      {mapModalOpen && (
        <div className="modal-overlay" onClick={() => setMapModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              title="Lovely Professional University Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3424.631663647552!2d75.70394637483127!3d31.255874860958317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a5ba59ac57ccf%3A0x3c15db108499c193!2sLovely%20Professional%20University!5e0!3m2!1sen!2sin!4v1712392765781!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
