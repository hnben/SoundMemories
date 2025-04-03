import './RequestAudioForm.css';
import { useState } from 'react';
import PropTypes from 'prop-types';
import CopyLink from './CopyLink.jsx';

const RequestAudioForm = ({ isOpen, onClose, children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputName, setinputName] = useState('');
  const [inputEmail, setinputEmail] = useState('');
  const [inputPhrase, setPhrase] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  if (!isOpen) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleNameChange = (e) => {
    setinputName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setinputEmail(e.target.value);
  };

  const handlePhraseChange = (e) => {
    setPhrase(e.target.value);
  };

  const handleTagChange = (e) => {
    const tagId = e.target.id;
    setSelectedTag(tagId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submittedData = {
      name: inputName,
      email: inputEmail,
      selectedTag: selectedTag,
      phrase: inputPhrase,
    }

    console.log(selectedTag);

    localStorage.setItem("requestAudioData", JSON.stringify(submittedData));
    setIsModalOpen(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalClick}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Request Audio Message</h2>
        <form onSubmit={handleSubmit} className="form-style">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" value={inputName} onChange={handleNameChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={inputEmail} onChange={handleEmailChange} required />
          </div>
          <div className="form-group">
            <label id="tagOptions">Choose a Tag</label>
            <div className="radio-toggle">
              <input
                type="radio"
                id="encouragement"
                name="options"
                className="radio-input"
                checked={selectedTag === 'encouragement'}
                onChange={handleTagChange}
              />
              <label htmlFor="encouragement" className="radio-label">Encouragement</label>

              <input
                type="radio"
                id="happy"
                name="options"
                className="radio-input"
                checked={selectedTag === 'happy'}
                onChange={handleTagChange}
              />
              <label htmlFor="happy" className="radio-label">Happy</label>

              <input
                type="radio"
                id="random"
                name="options"
                className="radio-input"
                checked={selectedTag === 'random'}
                onChange={handleTagChange}
              />
              <label htmlFor="random" className="radio-label">Random</label>

              <input
                type="radio"
                id="sad"
                name="options"
                className="radio-input"
                checked={selectedTag === 'sad'}
                onChange={handleTagChange}
              />
              <label htmlFor="sad" className="radio-label">Sad</label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="phrase">What phrase would you like them to record?</label>
            <input id="phrase" type="text" value={inputPhrase} onChange={handlePhraseChange} required />
          </div>
          <button className="submit-btn" type="submit">Submit</button>
        </form>
        <CopyLink
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          link="http://localhost:5173/contribute/3cq2i8eojyd1wb9jy03yem9mxkhajmga"
        />
        {children}
      </div>
    </div>
  );
};

RequestAudioForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default RequestAudioForm;