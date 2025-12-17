import React, { useState, useEffect, useRef } from 'react';
import DocItem from '@theme-original/DocItem';
import SelectionPopup from '@site/src/components/SelectionPopup';
import TranslateButton from '@site/src/components/TranslateButton';

export default function DocItemWrapper(props) {
  const [translatedContent, setTranslatedContent] = useState(null);
  const [isContentStored, setIsContentStored] = useState(false);
  const originalContentRef = useRef(null);

  const handleSelectText = (selectedText) => {
    console.log('Selected text for chat:', selectedText);
    // This function will be enhanced in T036 to interact with the ChatWidget
  };

  const handleTranslation = (translatedMd) => {
    setTranslatedContent(translatedMd);
  };

  // Function to restore original content
  const restoreOriginalContent = () => {
    setTranslatedContent(null);
  };

  // Store original content after the component has rendered
  useEffect(() => {
    // Use a timeout to ensure DOM is fully rendered
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
            // Process the translated markdown content to ensure proper HTML structure
            // Convert basic markdown elements to HTML
            let processedContent = translatedContent;

            // This is a more comprehensive markdown to HTML conversion
            // First, protect code blocks and inline code to avoid processing them
            const codeBlockRegex = /(```[\s\S]*?```|`[^`]*`)/g;
            const codeBlocks = [];
            processedContent = processedContent.replace(codeBlockRegex, (match) => {
              const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
              codeBlocks.push(match);
              return placeholder;
            });

            // Process markdown elements (excluding protected code blocks)
            processedContent = processedContent
              // Convert headings (must be on their own lines)
              .replace(/^\s*###### (.*$)/gm, '<h6>$1</h6>')
              .replace(/^\s*##### (.*$)/gm, '<h5>$1</h5>')
              .replace(/^\s*#### (.*$)/gm, '<h4>$1</h4>')
              .replace(/^\s*### (.*$)/gm, '<h3>$1</h3>')
              .replace(/^\s*## (.*$)/gm, '<h2>$1</h2>')
              .replace(/^\s*# (.*$)/gm, '<h1>$1</h1>')
              // Convert bold formatting
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/__(.*?)__/g, '<strong>$1</strong>')
              // Convert italic formatting
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/_(.*?)_/g, '<em>$1</em>')
              // Convert links
              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
              // Convert images
              .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
              // Convert unordered lists (with proper nesting)
              .replace(/^\s*-\s+(.*$)/gm, '<li>$1</li>')
              .replace(/^\s*\*\s+(.*$)/gm, '<li>$1</li>')
              .replace(/^\s*\+\s+(.*$)/gm, '<li>$1</li>')
              // Convert ordered lists
              .replace(/^\s*\d+\.\s+(.*$)/gm, '<li>$1</li>')
              // Wrap list items in proper list tags
              .replace(/(<li>.*?)(?=\n\S|\n\s*\n|$)/gs, (match) => {
                if (match.includes('<li>')) {
                  // Check if it's already wrapped to avoid double-wrapping
                  if (!match.includes('<ul>') && !match.includes('<ol>')) {
                    // Determine if ordered or unordered list based on content
                    if (match.includes('1.</li>') || match.includes('2.</li>') || match.includes('3.</li>')) {
                      return `<ol>${match}</ol>`;
                    } else {
                      return `<ul>${match}</ul>`;
                    }
                  }
                }
                return match;
              })
              // Convert paragraphs (for plain text lines that are not other elements)
              .replace(/^\s*(.+)$/gm, (match, content) => {
                // Skip if it's already an HTML tag or list item
                if (content.startsWith('<') || content.startsWith('#') || content.match(/^\s*[-*+]\s/) || content.match(/^\s*\d+\.\s/)) {
                  return match;
                }
                return `<p>${content}</p>`;
              })
              // Handle line breaks within paragraphs
              .replace(/<p>(.*?)\n(.*?)<\/p>/g, '<p>$1<br>$2</p>')
              // Clean up multiple line breaks
              .replace(/\n\s*\n/g, '</p><p>')
              // Restore code blocks
              .replace(/__CODE_BLOCK_(\d+)__/g, (match, index) => codeBlocks[parseInt(index)]);

            // Final cleanup: fix any malformed HTML
            processedContent = processedContent
              .replace(/<p><\/p>/g, '')
              .replace(/<p><(ul|ol|li|h1|h2|h3|h4|h5|h6)/g, '<$1')
              .replace(/(\/ul>|\/ol>|\/li>|\/h1>|\/h2>|\/h3>|\/h4>|\/h5>|\/h6>)<\/p>/g, '$1')
              .replace(/<p>/g, '<p>')
              .replace(/<p><p>/g, '<p>')
              .replace(/<\/p><\/p>/g, '</p>');

            markdownElement.innerHTML = processedContent;
          } else {
            // Show original content
            markdownElement.innerHTML = originalContentRef.current;
          }
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [translatedContent, isContentStored]);

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
          rawContent={""} // We'll populate this when the DOM is ready
          onTranslated={handleTranslation}
          getContent={() => {
            // Get the actual markdown content from the rendered page
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
