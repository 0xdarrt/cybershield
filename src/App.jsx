import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import Layout from './layout/Layout';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import BreachAlertsPage from './pages/BreachAlertsPage';
import ThreatIntelligencePage from './pages/ThreatIntelligencePage';
import LearningModule from "./learning/LearningModule";
import BookmarksPage from './pages/BookmarksPage';
import AboutPage from './pages/AboutPage';
import ResourcePage from './pages/ResourcePage';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="cybershield-theme">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/resource/:id" element={<ResourcePage />} />
            <Route path="/breaches" element={<BreachAlertsPage />} />
            <Route path="/threats" element={<ThreatIntelligencePage />} />
            <Route path="/learn" element={<LearningHubPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
