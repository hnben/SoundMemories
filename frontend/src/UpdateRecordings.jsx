import { useState, useEffect } from 'react';
import './UpdateRecordings.css';

const UpdateRecordings = () => {
  const [audioData, setAudioData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [fileDesc, setFileDesc] = useState("");
  const [sender, setSender] = useState("");
  const [audioId, setAudioId] = useState("");
  const [tags, setTags] = useState({}); // Store tagId
  const [tagNames, setTagNames] = useState({}); // Store tag_name
  const [availableTags, setAvailableTags] = useState([]); // Store available tags

  // Fetch audio data and associated tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const audioResponse = await fetch('http://localhost:3000/audio/');
        const audioData = await audioResponse.json();
        setAudioData(audioData); 

        // Fetch tags for each audio file
        audioData.forEach(async (audio) => {
          const tagResponse = await fetch(`http://localhost:3000/audio/${audio.id}/tags`);
          const tagData = await tagResponse.json();

          if (tagData.length > 0) {
            setTags(prevTags => ({
              ...prevTags,
              [audio.id]: tagData[0].id, // Store tagId
            }));

            setTagNames(prevTagNames => ({
              ...prevTagNames,
              [audio.id]: tagData[0].tag_name, // Store tag_name separately
            }));
          }
        });

        // Fetch available tags for the dropdown
        const tagResponse = await fetch('http://localhost:3000/tags');
        const tagList = await tagResponse.json();
        setAvailableTags(tagList);
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
      audioId: audioId,  
      tagId: tags[audioId],  // Send tagId
    };

    try {
      const response = await fetch('http://localhost:3000/audio/update/tags', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      console.log('Updated audio data:', result);

      if (response.ok) {
        // Update UI to reflect changes
        setTagNames(prevTagNames => ({
          ...prevTagNames,
          [audioId]: availableTags.find(tag => tag.id === tags[audioId])?.tag_name || "No Tag"
        }));
      } else {
        console.error('Failed to update audio file');
      }
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
      setAudioData(audioData.filter(audio => audio.id !== audioId));
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

            {/* Tag Display */}
            <div className="tag-row">
              <span className="tag-pill">
                {tagNames[audio.id] || "No Tag"}
              </span>
            </div>

            {/* Tag Edit */}
            {isEditing && audio.id === audioId && (
              <div className="tag-edit-row">
                <select
                  value={tags[audio.id] || ""}
                  onChange={(e) => {
                    const selectedTagId = Number(e.target.value);
                    setTags(prevTags => ({
                      ...prevTags,
                      [audio.id]: selectedTagId, // Store tagId
                    }));
                    setTagNames(prevTagNames => ({
                      ...prevTagNames,
                      [audio.id]: availableTags.find(tag => tag.id === selectedTagId)?.tag_name || "No Tag",
                    }));
                  }}
                >
                  <option value="">Select Tag</option>
                  {availableTags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.tag_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
