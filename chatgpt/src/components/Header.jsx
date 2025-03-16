import React from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">ChatApp 💬</div>
        {user && (
          <div className="nav-section">
            <div className="user-greeting">
              👋 Welcome, <span className="username">{user.username}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;



