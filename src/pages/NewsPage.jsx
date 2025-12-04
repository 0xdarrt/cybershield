import { useEffect, useState } from "react";
import "./News.css"; // optional, we will define styles below

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalArticle, setModalArticle] = useState(null);

  // Fetch live news from API
  async function loadNews() {
    try {
      const response = await fetch("/api/fetchNews");
      const json = await response.json();
      setNews(json.articles || []);
      setLoading(false);

      // Save articles in localStorage for modal lookup
      localStorage.setItem("newsData", JSON.stringify(json.articles || []));
    } catch (err) {
      console.error("Error loading news:", err);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  // Handle opening modal for full article
  const openModal = (article) => {
    setModalArticle(article);
  };

  // Handle closing modal
  const closeModal = () => {
    setModalArticle(null);
  };

  if (loading) return <p>Loading news...</p>;

  return (
    <div className="news-container">
      <h1>Cybersecurity News</h1>

      {news.length === 0 && <p>No news available.</p>}

      <div className="news-grid">
        {news.map((item, index) => (
          <div key={index} className="news-card">
            {item.image && <img src={item.image} alt={item.title} />}
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button className="read-more" onClick={() => openModal(item)}>
              Read Full Article →
            </button>
          </div>
        ))}
      </div>

      {/* Modal for full article */}
      {modalArticle && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h2>{modalArticle.title}</h2>
            {modalArticle.image && (
              <img src={modalArticle.image} alt={modalArticle.title} />
            )}
            <p>{modalArticle.description}</p>
            <iframe
              src={modalArticle.url}
              style={{ width: "100%", height: "70vh", border: "none" }}
            ></iframe>
            <button onClick={closeModal} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
