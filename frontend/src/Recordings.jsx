import { useState, useEffect } from 'react';
import './App.css';

const HomeRecordings = () => {
    const [homeRecordings, setRecordings] = useState([]);
    useEffect(() => {
        const fetchHomeAudio = async () => {
            try {
                //fetch audio file names from the backend
                const audioList = await fetch("http://localhost:3000/home");
                if (!audioList.ok) {
                    throw new Error("Failed to fetch");
                }
                //convert audio files name list to json and set the state with set recordings 
                const data = await audioList.json();
                setRecordings(data);
            } 
            catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        
        fetchHomeAudio();
    }, []);

    return (
        //return mapped html elements for each audio file 
        //using key=index for now but may want to change in the future to audio.id to 
        //track audio files more effectively for delete functions etc.
        <section>
            {homeRecordings.map((name, index) => (
                <div key={index}>
                <label>{name}</label>
                <audio controls src={`http://localhost:3000/Files/${name}`} />
                <br />
                </div>
            ))}
        </section> 
    );
};

  export default HomeRecordings;