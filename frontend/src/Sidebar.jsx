import { Link } from "react-router-dom";
import "./Sidebar.css"; // Create a separate CSS file for styling

const Sidebar = () => {
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
      </ul>
    </nav>
  );
};

export default Sidebar;
