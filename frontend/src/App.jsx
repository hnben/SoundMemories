import './App.css';
import MoodButtons from './MoodButtons.jsx';
import Recordings from './Recordings.jsx';
import Modal from './RequestAudioForm.jsx';
import { useState } from "react";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  //returns the frontend
  return (
    <>
      <h1>Sound Memories Frontend Test</h1>
      <MoodButtons></MoodButtons>
      <Recordings></Recordings>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      </Modal>
    </>
  );
}

export default App;
