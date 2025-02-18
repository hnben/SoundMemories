import { useState, useEffect } from 'react';
import './App.css';
import MoodButtons from './MoodButtons.jsx';

function App() {
  const [message, setMessage] = useState("");

  //function to fetch the backend API
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await fetch("http://localhost:3000/hello");
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setMessage(data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMessage();
  }, []);

  //returns the frontend
  return (
    <>
      <h1>Sound Memories Frontend Test</h1>
      <p>{message}</p> 
      <MoodButtons></MoodButtons>
    </>
  );
}

export default App;
