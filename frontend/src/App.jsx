import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "./App.css";
import Recordings from "./Recordings.jsx";
import ManageAudio from "./ManageAudio.jsx";
import RecordAudioRequest from "./RecordAudioRequest.jsx";
import RequestAudioForm from "./RequestAudioForm.jsx";

import { useState } from "react";
import Sidebar from "./Sidebar.jsx";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  {/* Button to open the modal */}
  <button onClick={() => setIsModalOpen(true)}>
    Request Audio Form
  </button>

  return (
    <Router>
      <div className="app-container">
        {/* Main content */}
        <Sidebar />
        <div className="main-content">
          <h1>Sound Memories</h1>
          <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
        
        {/* Routes for the different*/}
          <Routes>
            <Route path="/" element={<Recordings />} />
            <Route path="/manage-audio" element={<ManageAudio />} />
            <Route path="/contribute/3cq2i8eojyd1wb9jy03yem9mxkhajmga" element={<RecordAudioRequest />} />
          </Routes>
          <RequestAudioForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      </div>
    </Router>
  );
}

export default App;
