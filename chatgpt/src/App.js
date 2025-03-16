import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Chat from "./components/Chat";
import { useAuth } from "./context/authContext"; 
import "./App.css";

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/chat" /> : <Login />}
        />
        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={user ? "/chat" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
