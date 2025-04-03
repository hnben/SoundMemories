import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {useState} from "react";

import "./App.css";

import Recordings from "./Recordings.jsx";
import ManageAudio from "./ManageAudio.jsx";
import RecordAudioRequest from "./RecordAudioRequest.jsx";
import RequestAudioForm from "./RequestAudioForm.jsx";
import Sidebar from "./Sidebar.jsx";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        {/* Main content */}
        <Sidebar setIsModalOpen={setIsModalOpen}/>
        <div className="main-content">
          <h1>Sound Memories</h1>
        {/* Routes for the different*/}
          <Routes>
            <Route path="/" element={<Recordings />} />
            <Route path="/manage-audio" element={<ManageAudio />} />
            <Route path="/contribute/3cq2i8eojyd1wb9jy03yem9mxkhajmga" element={<RecordAudioRequest />} />
          </Routes>
        </div>
        {isModalOpen && (<RequestAudioForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
            />
       )}
      </div>
    </Router>
  );
}

export default App;
