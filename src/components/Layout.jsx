import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Chatbot from "./Chatbot";
import "./Layout.css";

function Layout() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();

  // If already on the dedicated /chatbot page, don't show the duplicate floating modal
  const isChatbotPage = location.pathname === "/chatbot";

  return (
    <div className="app-layout">
      {/* Persistent Navigation Header */}
      <header className="header">
        <nav className="navbar">
          <Link to="/" className="logo">
            <i className="fa-solid fa-film logo-icon"></i> Movie App
          </Link>

          <div className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Movies
            </NavLink>

            <NavLink
              to="/tv"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              TV Shows
            </NavLink>

            <NavLink
              to="/wishlist"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <i className="fa-regular fa-heart"></i>
              <span>Wishlist</span>
            </NavLink>

            <NavLink
              to="/chatbot"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <i className="fa-solid fa-robot"></i>
              <span>AI Chatbot</span>
            </NavLink>
          </div>
        </nav>
      </header>

      {/* Dynamic Page Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Persistent Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Movie Streaming App. All rights reserved.</p>
          <p className="footer-credits">
            Powered by TMDB API & Google Gemini AI
          </p>
        </div>
      </footer>

      {/* Floating Chatbot Widget (persistent across all pages) */}
      {!isChatbotPage && (
        <div className="floating-chatbot-root">
          {/* Floating Toggle Button */}
          <button
            type="button"
            className={`floating-chat-trigger ${isChatOpen ? "active" : ""}`}
            onClick={() => setIsChatOpen((prev) => !prev)}
            aria-label="Toggle AI Movie Assistant"
            title="Chat with AI Movie Assistant"
          >
            {isChatOpen ? (
              <i className="fa-solid fa-xmark"></i>
            ) : (
              <i className="fa-solid fa-robot"></i>
            )}
          </button>

          {/* Floating Chatbot Modal/Window */}
          {isChatOpen && (
            <div className="floating-chat-popup">
              <div className="floating-chat-header-bar">
                <span>AI Movie Assistant</span>
                <button
                  type="button"
                  className="close-popup-btn"
                  onClick={() => setIsChatOpen(false)}
                  aria-label="Close chat"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="floating-chat-body">
                <Chatbot />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Layout;
