import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
    { name: "Breaches", path: "/breaches" },
    { name: "Threat Intel", path: "/threats" },
    { name: "Learn", path: "/learning" },
    { name: "Bookmarks", path: "/bookmarks" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur border-b border-gray-700">
      <div className="container mx-auto h-16 px-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-cyan-400" />
          <span className="text-xl font-bold">
            Cyber<span className="text-cyan-400">Shield</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium hover:text-cyan-400 transition ${
                location.pathname.startsWith(link.path)
                  ? "text-cyan-400"
                  : "text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-gray-700 transition"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-300" />
            ) : (
              <Moon className="h-5 w-5 text-blue-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700 py-4">
          <div className="flex flex-col space-y-4 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-sm ${
                  location.pathname.startsWith(link.path)
                    ? "text-cyan-400"
                    : "text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded hover:bg-gray-700 w-fit"
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
