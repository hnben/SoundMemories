import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "./App.css";
import Recordings from "./Recordings.jsx";
import ManageAudio from "./ManageAudio.jsx";
import Modal from "./RequestAudioForm.jsx";
import { useState } from "react";
import Sidebar from "./Sidebar.jsx";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        {/* Main content */}
        <Sidebar />
        <div className="main-content">
          <h1>Sound Memories Frontend Test</h1>
          <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
        
        {/* Routes for the different*/}
          <Routes>
            <Route path="/" element={<Recordings />} />
            <Route path="/manage-audio" element={<ManageAudio />} />
          </Routes>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      </div>
    </Router>
  );
}

export default App;
