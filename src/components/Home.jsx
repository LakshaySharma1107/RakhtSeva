import React from "react";
import { Link } from "react-router-dom"; // Ensure routing is properly configured
import "./home.css"; 

function Home() {
  return (
    <div className="home-container">
      <div className="overlay-text">
        Drop by Drop, You Can Make a Difference!
      </div>
      <div className="secondary-text">
        Donate blood responsibly, not on roads but at blood donation camps!
      </div>
      <div className="signup-text">
        Click on Sign Up to join us now!
      </div>
      <Link to="/signup" className="signup-button">
        Sign Up Now
      </Link>
    </div>
  );
}

export default Home;
