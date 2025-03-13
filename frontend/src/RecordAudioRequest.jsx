import './RecordAudioRequest.css';
import RecordView from './RecordView.jsx';

const RecordAudioRequest = () => {
  // Define the recipient's name, selected tag, and phrase
  const recipientName = "Angie";
  const selectedTag = "Encouragment";
  const phrase = "\"I know things are difficult right now, but I also know you've got what it takes to get through it.\"";

  return (
    <div className="recording-entire-container">
      <h1>
        {recipientName} has requested <br /> for you to send an audio message
      </h1>
      <h4>{selectedTag}</h4>
      <p className="phrase">{phrase}</p>
      <RecordView />
    </div>
  );
};

export default RecordAudioRequest;