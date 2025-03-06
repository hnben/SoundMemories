import { useState, useEffect } from "react";

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
          fileDesc: description, // Ensure 'file_desc' matches the backend expectation
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
      <button onClick={() => setIsOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Upload Audio</button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Upload Audio</h2>
            <form onSubmit={handleSubmit}>
              <input type="file" accept="audio/*" onChange={handleFileChange} required />
              <input type="text" placeholder="Sender Name" value={sender} onChange={handleSenderChange} required className="block w-full mt-2 p-2 border" />
              <input type="text" placeholder="Description (optional)" value={description} onChange={handleDescriptionChange} className="block w-full mt-2 p-2 border" />
              <select value={selectedTag} onChange={handleTagChange} className="block w-full mt-2 p-2 border">
                <option value="">Select Tag (Optional)</option>
                {tags.map(tag => (
                  <option key={tag.id} value={tag.id}>{tag.tag_name}</option>
                ))}
              </select>
              <div className="mt-4 flex justify-end">
                <button type="button" onClick={() => setIsOpen(false)} className="mr-2 px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadForm;
