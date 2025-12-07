import React from 'react';
import DocItem from '@theme-original/DocItem';
import SelectionPopup from '@site/src/components/SelectionPopup';

export default function DocItemWrapper(props) {
  const handleSelectText = (selectedText) => {
    console.log('Selected text for chat:', selectedText);
    // This function will be enhanced in T036 to interact with the ChatWidget
  };

  return (
    <>
      <DocItem {...props} />
      <SelectionPopup onSelectText={handleSelectText} />
    </>
  );
}
