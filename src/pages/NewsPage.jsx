import { useEffect, useState } from "react";
import { fetchCyberNews } from "../services/NewsService";
import "./NewsPage.css";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load news function
  async function loadNews() {
    try {
      const articles = await fetchCyberNews();
      setNews(articles);
      setLoading(false);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error loading news:", err);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNews(); // initial load
    const interval = setInterval(loadNews, 300000); // every 5 mins
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading...</p>;

  // Open modal preview
  function openModal(article) {
    setSelectedArticle(article);
    setModalOpen(true);
  }

  // Close modal
  function closeModal() {
    setSelectedArticle(null);
    setModalOpen(false);
  }

  return (
    <div className="news-container">
      <h1>Cybersecurity News</h1>
      {lastUpdated && <p className="last-updated">Last updated at {lastUpdated}</p>}

      {news.length === 0 && <p>No news available.</p>}

      <div className="news-grid">
        {news.map((item, index) => (
          <div key={index} className="news-card">
            <img src={item.image} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button className="read-more" onClick={() => openModal(item)}>
              Preview →
            </button>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="read-more">
              Read full article →
            </a>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && selectedArticle && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>Close</button>
            <h2>{selectedArticle.title}</h2>
            <p><em>{selectedArticle.source.name}</em></p>
            {selectedArticle.image && <img src={selectedArticle.image} alt={selectedArticle.title} />}
            <p>{selectedArticle.content || selectedArticle.description}</p>
            <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer" className="read-more">
              Read full article →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
