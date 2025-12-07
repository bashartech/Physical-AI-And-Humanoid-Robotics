import React, { useState, useEffect, useRef } from 'react';
import styles from './SelectionPopup.module.css'; // Assuming you create a CSS module

const SelectionPopup = ({ onSelectText }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const popupRef = useRef(null);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text.length > 0) {
        setSelectedText(text);
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setPosition({
          x: rect.left + window.scrollX + rect.width / 2,
          y: rect.top + window.scrollY - 10 // Position above the selection
        });
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAskAboutSelection = () => {
    onSelectText(selectedText);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={popupRef}
      className={styles.selectionPopup}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translateX(-50%)' // Center horizontally
      }}
    >
      <button onClick={handleAskAboutSelection}>Ask about selection</button>
    </div>
  );
};

export default SelectionPopup;
