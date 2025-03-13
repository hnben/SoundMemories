import PropTypes from 'prop-types';
import './CopyLink.css';

const CopyLink = ({ isOpen, onClose, link }) => {
  if (!isOpen) return null;

  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevent click from propagating to overlay
  };

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(link);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  return (
    <div className="modal-window" onClick={onClose}>
      <div className="modal-link-content" onClick={handleModalClick}>
        <span className="close-button-span" onClick={onClose}>&times;</span>
        <h2>
          Here&apos;s your personalized audio message link to share!
          <br></br>
          <br></br>
          <a href={link} target="_blank" rel="noopener noreferrer">
            {link}
          </a>
        </h2>
        <button className="copy-link-button"onClick={handleCopyClick}>Copy Link</button>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

CopyLink.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  link: PropTypes.string.isRequired,
};

export default CopyLink;