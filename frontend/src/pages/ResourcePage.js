import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResourcePage.css";

const ResourcePage = () => {
  const [books, setBooks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [hoveredBookIndex, setHoveredBookIndex] = useState(null);
  const [hoveredVideoIndex, setHoveredVideoIndex] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/books");
        setBooks(res.data.books);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    const fetchVideos = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/videos");
        setVideos(res.data.videos);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    };

    fetchBooks();
    fetchVideos();
  }, []);

  const handleSurveyRedirect = () => {
    navigate("/survey-form");
  };

  const openModal = (video) => setSelectedVideo(video);
  const closeModal = () => setSelectedVideo(null);

  const extractYouTubeId = (url) => {
    const regex = /(?:\?v=|\/embed\/|\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="resource-page">
      <div className="resource-hero">
        <h1 className="resource-quote">
          "Your present circumstances don’t determine where you go, they merely determine where you start."
        </h1>
        <h2 className="resource-subquote">
          "Healing takes time, and asking for help is a courageous step."
        </h2>
        <button className="survey-btn" onClick={handleSurveyRedirect}>
          Take the Assessment
        </button>
      </div>

      <div className="book-section">
        <h2>Motivational & Psychological Books</h2>
        <div className="book-cards">
          {books.length > 0 ? (
            books.map((book, index) => (
              <a
                href={book.link || "https://www.google.com/search?q=" + encodeURIComponent(book.title)}
                target="_blank"
                rel="noopener noreferrer"
                key={book._id}
                className="book-card-link"
              >
                <div
                  className="book-card"
                  onMouseEnter={() => setHoveredBookIndex(index)}
                  onMouseLeave={() => setHoveredBookIndex(null)}
                >
                  {hoveredBookIndex === index && (
                    <div className="book-popup popup-center">
                      <h4>{book.title}</h4>
                      <p><strong>Author:</strong> {book.author}</p>
                      <p><strong>Description:</strong> {book.description}</p>
                      <p><strong>Price:</strong> ₹{book.price}</p>
                      <p><strong>Rating:</strong> ⭐ {book.rating || "N/A"}</p>
                      <p className="hover-desc"><strong>More:</strong> {book.hoveredPopupDescription}</p>
                    </div>
                  )}
                  <img src={book.imageUrl} alt={book.title} />
                  <div className="book-details">
                    <h3>{book.title}</h3>
                    <p><strong>Author:</strong> {book.author}</p>
                    <p className="desc">{book.description}</p>
                    <p><strong>Price:</strong> ₹{book.price}</p>
                    <p><strong>Rating:</strong> ⭐ {book.rating || "N/A"}</p>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <p>No books available at the moment.</p>
          )}
        </div>
      </div>

      <div className="video-section">
        <h2>Helpful Video Resources</h2>
        <div className="video-cards">
          {videos.map((video, index) => {
            const videoId = extractYouTubeId(video.youtubeUrl);
            return (
              <div
                className="video-card"
                key={video._id}
                onMouseEnter={() => setHoveredVideoIndex(index)}
                onMouseLeave={() => setHoveredVideoIndex(null)}
              >
                <div className="video-thumb-container" onClick={() => openModal(video)}>
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt="Video thumbnail"
                    className="video-thumbnail"
                  />
                  <div className="youtube-play-button">▶</div>
                </div>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                {hoveredVideoIndex === index && (
                  <div className="video-popup popup-center">
                    <strong>Hover Preview:</strong> {video.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedVideo && (
        <div className="video-modal-overlay" onClick={closeModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${extractYouTubeId(selectedVideo.youtubeUrl)}?autoplay=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={selectedVideo.title}
            ></iframe>
            <button className="close-modal" onClick={closeModal}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcePage;
