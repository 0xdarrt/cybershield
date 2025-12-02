# CyberShield - Real-Time Cyber Intelligence Hub

CyberShield is a professional-grade dashboard for real-time cybersecurity news, breach alerts, and threat intelligence.

## 🚀 Features

*   **Real-Time News Feed:** Live updates from NewsAPI.org with smart filtering.
*   **Smart Breach Detector:** Heuristic scanning for compromised emails.
*   **Live Threat Map:** Real-time visualization of global cyber attacks.
*   **Interactive Learning:** Cyber IQ Quiz and educational resources.
*   **Cyberpunk UI:** Deep dark theme with neon aesthetics and CRT effects.

## 🛠️ Tech Stack

*   **Frontend:** React (Vite)
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM
*   **Charts:** Recharts
*   **Animations:** Framer Motion

## 📦 Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/cybershield.git
    cd cybershield
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env` file in the root directory:
    ```env
    VITE_NEWS_API_KEY=your_newsapi_key_here
    ```
    *Get a free key from [newsapi.org](https://newsapi.org).*

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## 🌍 Deployment Guide

### GitHub
1.  Initialize Git:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a new repository on GitHub.
3.  Push your code:
    ```bash
    git remote add origin https://github.com/yourusername/cybershield.git
    git push -u origin main
    ```

### Vercel (Recommended)
1.  Go to [Vercel.com](https://vercel.com) and sign up/login.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `cybershield` GitHub repository.
4.  **Environment Variables:**
    *   Add `VITE_NEWS_API_KEY` with your API key value.
5.  Click **Deploy**.

Vercel will automatically detect the Vite framework and build settings. Your site will be live in minutes!

## 📄 License
MIT License.
