import { useState, useEffect } from 'react';
import './UpdateRecordings.css';

const UpdateRecordings = () => {
  const [audioData, setAudioData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [fileDesc, setFileDesc] = useState("");
  const [sender, setSender] = useState("");
  const [audioId, setAudioId] = useState("");

  // Fetch audio data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/audio/');
        const data = await response.json();
        setAudioData(data); // Set all audio data from the database
      } catch (error) {
        console.error('Error fetching audio data:', error);
      }
    };
    fetchData();
  }, []);

  // Handle editing of file description and sender
  const handleEditClick = (id, desc, sender) => {
    setIsEditing(true);
    setAudioId(id);
    setFileDesc(desc);
    setSender(sender);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    const updatedData = { 
      fileId: audioId, 
      fileDesc: fileDesc, 
      sender: sender 
    };

    try {
      const response = await fetch(`http://localhost:3000/audio/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();
      console.log('Updated audio data:', result);

      // Update the audio data locally after the save
      setAudioData(prevData => 
        prevData.map(audio => 
          audio.id === audioId ? { ...audio, file_desc: fileDesc, sender: sender } : audio
        )
      );
    } catch (error) {
      console.error('Error updating audio data:', error);
    }
  };

  // Handle deleting audio file
  const handleDeleteClick = async (audioId) => {
    try {
      const response = await fetch(`http://localhost:3000/audio/${audioId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      console.log('Audio file deleted:', result);
      setAudioData(audioData.filter(audio => audio.id !== audioId)); // Remove the deleted audio from the list
    } catch (error) {
      console.error('Error deleting audio:', error);
    }
  };

  return (
    <div className="recording-cards-container">
      {audioData.length > 0 ? (
        audioData.map((audio) => (
          <div className="recording-card" key={audio.id}>
            {/* Sender */}
            <div className="sender-row">
              {isEditing && audio.id === audioId ? (
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="sender-input"
                />
              ) : (
                <span className="sender">{audio.sender}</span>
              )}
            </div>

            {/* Audio Element */}
            <div className="audio-row">
              <audio controls>
                <source src={`http://localhost:3000/${audio.file_path}`} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </div>

            {/* Description */}
            <div className="description-row">
              <strong>Description:</strong>
              {isEditing && audio.id === audioId ? (
                <input
                  type="text"
                  value={fileDesc}
                  onChange={(e) => setFileDesc(e.target.value)}
                  className="description-input"
                />
              ) : (
                <span className="description">{audio.file_desc}</span>
              )}
            </div>

            {/* Buttons */}
            <div className="buttons-container">
              <div>
                {isEditing && audio.id === audioId ? (
                  <button onClick={handleSaveClick} className="save-button">Save</button>
                ) : (
                  <button onClick={() => handleEditClick(audio.id, audio.file_desc, audio.sender)} className="edit-button">Edit</button>
                )}
              </div>

              <div>
                <button onClick={() => handleDeleteClick(audio.id)} className="delete-button">Delete Audio</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No audio files available</p>
      )}
    </div>
  );
};

export default UpdateRecordings;
