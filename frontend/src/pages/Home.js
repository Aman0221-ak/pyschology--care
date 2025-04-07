import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Home.css';

const Home = () => {
  const [services, setServices] = useState([]);
  const [books, setBooks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, bookRes, videoRes] = await Promise.all([
          fetch("http://localhost:8000/api/services"),
          fetch("http://localhost:8000/api/books"),
          fetch("http://localhost:8000/api/videos")
        ]);
  
        const serviceData = await serviceRes.json();
        const bookData = await bookRes.json();
        const videoData = await videoRes.json();
  
        setServices(Array.isArray(serviceData) ? serviceData : []);
        setBooks(bookData.books || []);
        setVideos(videoData.videos || []);

      } catch (error) {
        console.error("Error fetching home page data:", error);
        setServices([]);
        setBooks([]);
        setVideos([]);
      }
    };
  
    fetchData();
  }, []);

  const openVideoModal = (videoUrl) => {
    setSelectedVideo(videoUrl);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Your Mental Wellness Matters</h1>
          <p>Connect with professional psychologists and get the support you need.</p>
          <Link to="/psychologists" className="book-btn">Book a Session</Link>
        </div>
      </section>

      <section className="services-section">
        <h2>Our Services</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service._id} className="service-card">
              <img src={service.imageUrl} alt={service.title} />
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link to={`/services/${service._id}`} className="view-btn">View More</Link>
            </div>
          ))}
        </div>
      </section>

       {/* Books Section */}
       <section className="books-section">
        <h2>Recommended Books</h2>
        <div className="books-grid">
          {books.map((book) => (
            <div className="book-card" key={book._id}>
              <div className="book-image">
                <img src={book.imageUrl} alt={book.title} />
                <div className="book-popup">
                  <p>{book.description}</p>
                </div>
              </div>
              <h3>{book.title}</h3>
              <p className="author">{book.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Videos Section */}
      <section className="videos-section">
        <h2>Helpful Videos</h2>
        <div className="videos-grid">
        {videos.map((video) => {
  const getYouTubeId = (url) => {
    const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(video.youtubeUrl);
  const thumbnail = video.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="video-card" key={video._id}>
      <div className="video-thumbnail" onClick={() => openVideoModal(video.youtubeUrl)}>
        <img src={thumbnail} alt={video.title} />
        <div className="play-button">▶</div>
        <div className="video-popup">
          <p>{video.description}</p>
        </div>
      </div>
      <h3>{video.title}</h3>
    </div>
  );
})}

        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={closeModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`${selectedVideo.replace("watch?v=", "embed/")}?autoplay=1`}
              title="YouTube Video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
            <button className="close-btn" onClick={closeModal}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
