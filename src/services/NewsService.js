const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/everything';

// Fallback data in case API fails or no key provided
const MOCK_NEWS = [
    {
        source: { name: "The Hacker News" },
        author: "Ravie Lakshmanan",
        title: "Critical Zero-Day in Chrome Exploited in Wild (Simulated)",
        description: "Google has released an emergency update to patch a high-severity vulnerability (CVE-2025-1234) that is actively being exploited.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
        publishedAt: new Date().toISOString(),
        content: "Google has released an emergency update to patch a high-severity vulnerability (CVE-2025-1234) that is actively being exploited. The flaw allows for remote code execution via a crafted HTML page. Security researchers have observed this exploit being used in targeted attacks against financial institutions..."
    },
    {
        source: { name: "BleepingComputer" },
        author: "Lawrence Abrams",
        title: "Ransomware Gang Targets Healthcare Sector (Simulated)",
        description: "A new strain of ransomware known as 'DarkMed' is disrupting hospital operations across the region.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1470",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        content: "A new strain of ransomware known as 'DarkMed' is disrupting hospital operations across the region. Attackers are demanding $5M in Bitcoin. The malware spreads via phishing emails containing malicious Excel macros..."
    },
    {
        source: { name: "Dark Reading" },
        author: "Jai Vijayan",
        title: "New Phishing Campaign Mimics HR Emails (Simulated)",
        description: "Employees are being targeted with fake year-end review notifications containing malicious attachments.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1563206767-5b1d972eef5a?auto=format&fit=crop&q=80&w=1470",
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        content: "Employees are being targeted with fake year-end review notifications containing malicious attachments. The emails appear to come from internal HR domains but actually originate from compromised external servers..."
    },
    {
        source: { name: "ToolWatch" },
        author: "SecTeam",
        title: "Top 5 Open Source OSINT Tools for 2025",
        description: "A curated list of the best open-source intelligence tools for security researchers and penetration testers.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=1470",
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        content: "Open Source Intelligence (OSINT) is a critical skill for modern security professionals. In this report, we analyze the top tools including Maltego, Shodan, and TheHarvester..."
    },
    {
        source: { name: "CyberDefense Mag" },
        author: "Dr. A. Smith",
        title: "Whitepaper: The Future of Quantum Cryptography",
        description: "Understanding the implications of quantum computing on current encryption standards.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1470",
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        content: "Quantum computing poses a significant threat to RSA and ECC encryption. This whitepaper explores post-quantum cryptographic algorithms and transition strategies for enterprises..."
    }
];

export const fetchCyberNews = async () => {
    // In production, we use the Vercel Proxy (/api/news) to bypass CORS/Free Tier limits.
    // In development (localhost), we can call NewsAPI directly.
    const isProd = import.meta.env.PROD;

    let url;
    if (isProd) {
        url = '/api/news';
    } else {
        if (!API_KEY) {
            console.warn("No NewsAPI Key found. Using mock data.");
            return MOCK_NEWS;
        }
        url = `${BASE_URL}?q=cybersecurity OR malware OR ransomware OR "data breach"&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Handle case where proxy returns error JSON
        if (data.error) {
            throw new Error(data.error);
        }

        // Filter out articles with no image or removed content
        const validArticles = (data.articles || []).filter(article =>
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
