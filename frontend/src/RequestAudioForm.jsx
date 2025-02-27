import './RequestAudioForm.css';
import { useState } from 'react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, children }) => {
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [inputValue3, setInputValue3] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  if (!isOpen) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleInputChange1 = (e) => {
    setInputValue1(e.target.value);
  };

  const handleInputChange2 = (e) => {
    setInputValue2(e.target.value);
  };

  const handleInputChange3 = (e) => {
    setInputValue3(e.target.value);
  };

  const handleTagChange = (e) => {
    const tagId = e.target.id;
    setSelectedTag(tagId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Input 1:', inputValue1);
    console.log('Input 2:', inputValue2);
    console.log('Input 3:', inputValue3);
    console.log('Selected Tag:', selectedTag);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalClick}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Request Audio Message</h2>
        <form onSubmit={handleSubmit} className="form-style">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" value={inputValue1} onChange={handleInputChange1} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={inputValue2} onChange={handleInputChange2} required />
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
                id="love"
                name="options"
                className="radio-input"
                checked={selectedTag === 'love'}
                onChange={handleTagChange}
              />
              <label htmlFor="love" className="radio-label">Love</label>

              <input
                type="radio"
                id="support"
                name="options"
                className="radio-input"
                checked={selectedTag === 'support'}
                onChange={handleTagChange}
              />
              <label htmlFor="support" className="radio-label">Support</label>

              <input
                type="radio"
                id="journey"
                name="options"
                className="radio-input"
                checked={selectedTag === 'journey'}
                onChange={handleTagChange}
              />
              <label htmlFor="journey" className="radio-label">Journey</label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="phrase">What phrase would you like them to record?</label>
            <input id="phrase" type="text" value={inputValue3} onChange={handleInputChange3} required />
          </div>
          <button className="submit-btn" type="submit">Submit</button>
        </form>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default Modal;