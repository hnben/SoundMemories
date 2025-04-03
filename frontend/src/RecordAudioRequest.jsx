import './RecordAudioRequest.css';
import PropTypes from 'prop-types';
import RecordView from './RecordView.jsx';
import { useEffect, useState } from 'react';

const RecordAudioRequest = () => {
  const [requestData, setRequestData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("requestAudioData");
    if (data) {
      setRequestData(JSON.parse(data))
    }
  }, [])

  if (!requestData) return <p>No request found.</p>

  return (
    <div className="recording-entire-container">
      <h1>
        Angela has requested <br /> for you to send an audio message
      </h1>
      <h4>{requestData.selectedTag}</h4>
      <p className="phrase">{requestData.phrase}</p>
      <RecordView />
    </div>
  );
};

RecordAudioRequest.propTypes = {
  data: PropTypes.array.isRequired,
  recipientName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  selectedTag: PropTypes.string.isRequired,
  phrase: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default RecordAudioRequest;