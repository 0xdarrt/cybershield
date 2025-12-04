export const fetchCyberNews = async () => {
  try {
    const response = await fetch("/api/fetchNews");
    if (!response.ok) throw new Error("Failed to fetch GNews API");
    const data = await response.json();

    const validArticles = (data.articles || []).filter(
      (article) =>
        article.image && article.title && article.description
    );

    return validArticles.length > 0 ? validArticles : [];
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
  }
};
