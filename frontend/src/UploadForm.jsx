import { useState, useEffect } from "react";
import './UploadForm.css';

const UploadForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);
  const [sender, setSender] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/tags")
      .then((res) => res.json())
      .then((data) => setTags(data))
      .catch((err) => console.error("Error fetching tags:", err));
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleSenderChange = (e) => setSender(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleTagChange = (e) => setSelectedTag(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    
    const formData = new FormData();
    formData.append("audio", file);
    
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
          fileDesc: description,
          sender,
          isExternal: 0,
          externalSource: "",
          externalFileId: "",
          externalFileUrl: "",
        }),
      });
      const audioData = await audioRes.json();
      if (!audioRes.ok) throw new Error(audioData.error);

      if (selectedTag) {
        await fetch("http://localhost:3000/audio/assign-tag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audioId: audioData.newFile, tagId: selectedTag }),
        });
      }

      alert("Audio uploaded successfully");
      setIsOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="upload-button">Upload Audio</button>
      {isOpen && (
        <div className="overlay">
          <div className="form-container">
            <h2 className="form-heading">Upload Audio</h2>
            <form onSubmit={handleSubmit} className="upload-form">
              <input type="file" accept="audio/*" onChange={handleFileChange} required className="file-input"/>
              <input type="text" placeholder="Sender Name" value={sender} onChange={handleSenderChange} required className="text-input" />
              <input type="text" placeholder="Description (optional)" value={description} onChange={handleDescriptionChange} className="text-input" />
              <select value={selectedTag} onChange={handleTagChange} className="select-input">
                <option value="">Select Tag (Optional)</option>
                {tags.map(tag => (
                  <option key={tag.id} value={tag.id}>{tag.tag_name}</option>
                ))}
              </select>
              <div className="button-container">
                <button type="button" onClick={() => setIsOpen(false)} className="cancel-button">Cancel</button>
                <button type="submit" className="submit-button">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadForm;
