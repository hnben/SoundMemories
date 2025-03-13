import { useState } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import './RecordView.css';

const RecordView = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [receiverName, setReceiverName] = useState("Dad");
  const [audioDescription, setDescription] = useState("A heartfelt message to lift your spirits during challenging times.");
  const [selectedTagState, setSelectedTagState] = useState(1);

  const handleStopRecording = async (blobUrl, blob) => {
    setMediaBlobUrl(blobUrl);
    const recordedFile = new File([blob], "recorded_audio.wav", { type: "audio/wav" });
    setAudioFile(recordedFile);
  };

  const handleUpload = async () => {
    if (!audioFile) {
      alert("No recorded audio to upload!");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const uploadRes = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error);

      const filePath = `Files/${uploadData.filename}`;

      const audioRes = await fetch("http://localhost:3000/audio/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1,
          fileName: uploadData.filename,
          filePath,
          description: audioDescription,
          sender: receiverName,
          isExternal: 0,
          externalSource: "",
          externalFileId: "",
          externalFileUrl: "",
        }),
      });

      const audioData = await audioRes.json();
      if (!audioRes.ok) throw new Error(audioData.error);

      if (selectedTagState) {
        await fetch("http://localhost:3000/audio/assign-tag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audioId: audioData.newFile, tagId: selectedTagState }),
        });
      }

      alert("Audio recorded and uploaded successfully!");
      setMediaBlobUrl(mediaBlobUrl);
      setAudioFile(null);
      setReceiverName(receiverName);
      setDescription(audioDescription);
      setSelectedTagState(selectedTagState);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    }
  };

  return (
    <div className="recording-controls">
      <h2>Record Audio</h2>
      <ReactMediaRecorder
        audio
        blobPropertyBag={{ type: "audio/wav" }}
        render={({ startRecording, stopRecording, mediaBlobUrl }) => (
          <div>
            <button
              className="start-recording-button"
              onClick={startRecording}
            >
              Start Recording
            </button>
            <button
              className="stop-recording-button"
              onClick={stopRecording}
            >
              Stop Recording
            </button>
            <audio src={mediaBlobUrl} controls autoPlay loop />
          </div>
        )}
        onStop={handleStopRecording}
      />
      <button
        className="upload-audio-button"
        onClick={handleUpload}
      >
        Upload Audio
      </button>
    </div>
  );
};

export default RecordView;