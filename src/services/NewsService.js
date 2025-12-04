const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2/everything";

// Mock news if API fails
const MOCK_NEWS = [
  {
    source: { name: "The Hacker News" },
    author: "Ravie Lakshmanan",
    title: "Critical Zero-Day in Chrome Exploited in Wild (Simulated)",
    description:
      "Google has released an emergency update to patch a high-severity vulnerability (CVE-2025-1234) that is actively being exploited.",
    url: "#",
    urlToImage:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
    publishedAt: new Date().toISOString(),
    content:
      "Google has released a patch for CVE-2025-1234. The flaw allows RCE via a crafted HTML page. Researchers observed this in targeted attacks."
  },
  // add other mock articles if needed
];

// Fetch news function
export const fetchCyberNews = async () => {
  const isProd = import.meta.env.PROD;

  let url;
  if (isProd) {
    // Use your Vercel serverless proxy in production
    url = "/api/news"; 
  } else {
    // Use NewsAPI directly in dev
    if (!API_KEY) {
      console.warn("No NewsAPI Key found. Using mock data.");
      return MOCK_NEWS;
    }
    url = `${BASE_URL}?q=cybersecurity OR malware OR ransomware OR "data breach"&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    const data = await response.json();

    // If API returns error
    if (data.error) throw new Error(data.error);

    // Filter valid articles
    const validArticles = (data.articles || []).filter(
      (article) =>
        article.urlToImage &&
        article.title !== "[Removed]" &&
        article.description
    );

    return validArticles.length > 0 ? validArticles : MOCK_NEWS;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return MOCK_NEWS;
  }
};
