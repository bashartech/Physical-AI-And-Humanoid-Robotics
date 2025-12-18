import React, { useState, useEffect, useRef } from 'react';
import DocItem from '@theme-original/DocItem';
import SelectionPopup from '@site/src/components/SelectionPopup';
import TranslateButton from '@site/src/components/TranslateButton';
import markdownToHtml from '@site/src/utils/markdownToHtml'; // Import the markdown converter

export default function DocItemWrapper(props) {
  const [translatedContent, setTranslatedContent] = useState(null);
  const [isContentStored, setIsContentStored] = useState(false);
  const originalContentRef = useRef(null);
  const [currentLanguage, setCurrentLanguage] = useState('en'); // Track the currently displayed language

  const handleSelectText = (selectedText) => {
    console.log('Selected text for chat:', selectedText);
    // This function will be enhanced in T036 to interact with the ChatWidget
  };

  const handleTranslation = (translatedMd, targetLang) => {
    setTranslatedContent(translatedMd);
    setCurrentLanguage(targetLang); // Update current language when translated
  };

  // Function to restore original content
  const restoreOriginalContent = () => {
    setTranslatedContent(null);
    setCurrentLanguage('en'); // Reset to original language
  };

  // Store original content after the component has rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      const contentElement = document.querySelector('article div.markdown, article .markdown');
      if (contentElement && !isContentStored) {
        originalContentRef.current = contentElement.innerHTML;
        setIsContentStored(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isContentStored]);

  // Update content based on translation state after DOM is ready
  useEffect(() => {
    if (isContentStored) {
      const timer = setTimeout(() => {
        const markdownElement = document.querySelector('article div.markdown, article .markdown');
        if (markdownElement) {
          if (translatedContent) {
            // Convert markdown to HTML before inserting using our utility
            const processedHtml = markdownToHtml(translatedContent);
            markdownElement.innerHTML = processedHtml;

            // Apply RTL class if Urdu
            if (currentLanguage === 'ur') {
              markdownElement.classList.add('rtl-urdu-content');
            } else {
              markdownElement.classList.remove('rtl-urdu-content');
            }
          } else {
            // Show original content
            markdownElement.innerHTML = originalContentRef.current;
            markdownElement.classList.remove('rtl-urdu-content'); // Remove RTL class for original content
          }
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [translatedContent, isContentStored, currentLanguage]);

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px',
        padding: '0 20px',
        gap: '10px'
      }}>
        <TranslateButton
          chapterPath={props.content.metadata?.permalink || window.location.pathname || ''}
          rawContent={""} // Will be fetched via getContent
          onTranslated={(md, lang) => handleTranslation(md, lang)} // Pass target language
          getContent={() => {
            const markdownElement = document.querySelector('article div.markdown, article .markdown');
            return markdownElement ? markdownElement.innerText || markdownElement.textContent || '' : '';
          }}
        />
        {translatedContent && (
          <button
            onClick={restoreOriginalContent}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Show Original
          </button>
        )}
      </div>
      <DocItem {...props} />
      <SelectionPopup onSelectText={handleSelectText} />
    </>
  );
}
