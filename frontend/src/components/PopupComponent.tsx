import React from 'react';
import './PopupComponent.css';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const PopupComponent: React.FC<PopupProps> = ({ isOpen, onClose, content }) => {
  return isOpen ? (
    <div className="overlay" onClick={onClose}>
      <div className="assignedTaskForm" onClick={(e) => e.stopPropagation()}>
        <div className="content">{content}</div>
        <button className="closeButton" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  ) : null;
};

export default PopupComponent;
