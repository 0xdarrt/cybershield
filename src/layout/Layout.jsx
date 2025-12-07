import React from "react";
import Navbar from "../components/Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <main className="pt-20 px-4">
        {children}
      </main>
    </div>
  );
}

