import { useState, useEffect } from 'react';
import './App.css';

const Recordings = () => {
    const [homeRecordings, setRecordings] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);

    const tags = ["happy", "sad", "encouraging", "random"];

    // Fetch audio files based on selected tag
    useEffect(() => {
        const fetchHomeAudio = async () => {
            try {
                const tagQuery = selectedTag ? `tag/${selectedTag}` : ''; 
                const audioList = await fetch(`http://localhost:3000/audio/${tagQuery}`);
                if (!audioList.ok) {
                    throw new Error("Failed to fetch");
                }
                const data = await audioList.json();
                setRecordings(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchHomeAudio();
    }, [selectedTag]);

    // Toggle tag selection
    const handleTagToggle = (tag) => {
        setSelectedTag((prevTag) => (prevTag === tag ? null : tag));
    };

    return (
        <section>
            {/* Tag filter pills */}
            <div className="filter-tags">
                {tags.map((tag) => (
                    <button
                        key={tag}
                        className={`pill ${selectedTag === tag ? 'active' : ''}`}
                        onClick={() => handleTagToggle(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Display audio files */}
            <div className="audio-list">
                {homeRecordings.length === 0 ? (
                    <p>No audio files available</p>
                ) : (
                    homeRecordings.map((file, index) => (
                        <div className="audio-card" key={index}>
                            <label>{file.file_name}</label>
                            <audio controls src={`http://localhost:3000/Files/${file.file_name}`} />
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default Recordings;
