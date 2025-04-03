import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// import { useState } from "react";
import "./Sidebar.css"; // Create a separate CSS file for styling

const Sidebar = ({ setIsModalOpen }) => {

  return (
    <nav className="sidebar">
      <h2>Navigation</h2>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/manage-audio">Manage Audio</Link>
        </li>
        <li>
          <button id="request-audio-form"onClick={() => { setIsModalOpen(true)} }>Request Audio Form</button>
        </li>
      </ul>
    </nav>
  );
};

// Define PropTypes for the Sidebar component
Sidebar.propTypes = {
  setIsModalOpen: PropTypes.func.isRequired,
};

export default Sidebar;
