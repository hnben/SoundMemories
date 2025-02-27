import { useState, useEffect } from 'react';
import './App.css';

const HomeRecordings = () => {
    const [homeRecordings, setRecordings] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);  // To store the selected tag name

    const tags = ["happy", "sad", "encouraging", "random"]; // List of tag names

    // Fetch audio files based on selected tag or fetch all when no tag is selected
    useEffect(() => {
        const fetchHomeAudio = async () => {
            try {
                const tagQuery = selectedTag ? `tag/${selectedTag}` : ''; // Append tag to the endpoint if selected
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
    }, [selectedTag]); // Fetch data whenever the selectedTag changes

    // Handle toggling tag selection
    const handleTagToggle = (tag) => {
        setSelectedTag((prevTag) => (prevTag === tag ? null : tag)); // Toggle the selected tag
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
                        <div key={index}>
                            <label>{file.file_name}</label>
                            <audio controls src={`http://localhost:3000/Files/${file.file_name}`} />
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default HomeRecordings;
