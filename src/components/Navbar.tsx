import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // Clear user session data
    // For example, you might remove tokens or user information from local storage
    localStorage.removeItem("userToken"); // Adjust key names as needed
    localStorage.removeItem("userData");

    // Optionally, call an API to invalidate the session on the server
    // fetch('/api/logout', { method: 'POST', credentials: 'include' })
    //   .then(response => {
    //     if (response.ok) {
    //       // Successful logout
    //     } else {
    //       // Handle errors
    //     }
    //   });

    // Redirect to the login page or home page
    navigate("/login"); // Adjust the path as needed

    setMenuOpen(false); // Close the menu after logout
  };

  return (
    <div className="navbar">
      <div className="navbar-title">Race The Clock</div>
      <div className="hamburger-menu" onClick={handleMenuToggle}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      {menuOpen && (
        <div className="menu">
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
