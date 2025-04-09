import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Import React Router
import "./Nav.css"; // Ensure Nav.css is linked correctly

function Header() {
  const location = useLocation(); // Get current path
  const [useBar, setBar] = useState("Home");

  useEffect(() => {
    const path = location.pathname.replace("/", "") || "home"; // Extract path
    setBar(path.charAt(0).toUpperCase() + path.slice(1)); // Capitalize first letter
  }, [location]); // Update state when path changes

  
    if(location.pathname.includes("dashboard")){
      return(       
       <header className="header">
      <Link className="logo" to="/">RakhtSeva</Link>
      <nav className="navbar">
        <Link 
          to="/" 
          className={`nav-link ${useBar === "Home" ? "active" : ""}`}
        >
          Home
        </Link>
        <Link 
          to="/about" 
          className={`nav-link ${useBar === "About" ? "active" : ""}`}
        >
          About
        </Link>
        <Link 
          to="/contact" 
          className={`nav-link ${useBar === "Contact" ? "active" : ""}`}
        >
          Contact
        </Link>
      </nav>
    </header>
      )} 
    else{
      return (
    <header className="header">
      <Link className="logo" to="/">RakhtSeva</Link>
      <nav className="navbar">
        <Link 
          to="/" 
          className={`nav-link ${useBar === "Home" ? "active" : ""}`}
        >
          Home
        </Link>
        <Link 
          to="/about" 
          className={`nav-link ${useBar === "About" ? "active" : ""}`}
        >
          About
        </Link>
        <Link 
          to="/contact" 
          className={`nav-link ${useBar === "Contact" ? "active" : ""}`}
        >
          Contact
        </Link>
        <Link 
          to="/login" 
          className={`nav-link ${useBar === "Login" ? "active" : ""}`}
        >
          Login
        </Link>
        <Link 
          to="/signup" 
          className={`nav-link ${useBar === "Signup" ? "active" : ""}`}
        >
          Signup
        </Link>
      </nav>
    </header>
    )}
  ;
}

export default Header;
