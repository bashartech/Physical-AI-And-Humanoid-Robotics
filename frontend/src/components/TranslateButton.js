
import React, { useState } from "react";
// import { useAuth } from "../context/AuthContext";

const TranslateButton = ({ chapterPath, rawContent, selectedText, onTranslated, getContent }) => {
  // const { user, loading } = useAuth();

  const [targetLanguage, setTargetLanguage] = useState("ur");
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    // if (!user) {
    //   window.location.href = "http://localhost:3000/login";
    //   return;
    // }

    setIsLoading(true);

    try {
      // Get the actual content from the page if getContent function is provided
      const contentToTranslate = getContent ? getContent() : rawContent;

      const res = await fetch("https://bashartc14-robotics-book.hf.space/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter_path: chapterPath,
          raw_md: contentToTranslate || rawContent,
          selected_text: selectedText || "",
          target_language: targetLanguage,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      onTranslated(data.translated_md);
    } catch (error) {
      console.error("Translation error:", error);
      alert(`Translation failed: ${error.message || "Please try again"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // No loading check needed since we removed auth dependency

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <select
        value={targetLanguage}
        onChange={(e) => setTargetLanguage(e.target.value)}
        style={{
          padding: '8px 12px',
          border: '1px solid #374151',
          borderRadius: '6px',
          backgroundColor: '#1f2937',
          color: '#fff',
          fontSize: '14px'
        }}
      >
        <option value="ur">Urdu</option>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
      </select>

      <button
        onClick={handleTranslate}
        disabled={isLoading}
        style={{
          padding: '8px 16px',
          backgroundColor: isLoading ? '#9ca3af' : '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        {isLoading ? "Translating..." : "Translate"}
      </button>
    </div>
  );
};

export default TranslateButton;
