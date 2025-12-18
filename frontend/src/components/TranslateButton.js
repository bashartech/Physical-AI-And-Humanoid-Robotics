
// import React, { useState } from "react";
// // import { useAuth } from "../context/AuthContext";

// const TranslateButton = ({ chapterPath, rawContent, selectedText, onTranslated, getContent }) => {
//   // const { user, loading } = useAuth();

//   const [targetLanguage, setTargetLanguage] = useState("ur");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleTranslate = async () => {
//     // if (!user) {
//     //   window.location.href = "http://localhost:3000/login";
//     //   return;
//     // }

//     setIsLoading(true);

//     try {
//       // Get the actual content from the page if getContent function is provided
//       const contentToTranslate = getContent ? getContent() : rawContent;

//       const res = await fetch("https://bashartc14-robotics-book.hf.space/translate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           chapter_path: chapterPath,
//           raw_md: contentToTranslate || rawContent,
//           selected_text: selectedText || "",
//           target_language: targetLanguage,
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();
//       onTranslated(data.translated_md);
//     } catch (error) {
//       console.error("Translation error:", error);
//       alert(`Translation failed: ${error.message || "Please try again"}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // No loading check needed since we removed auth dependency

//   return (
//     <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//       <select
//         value={targetLanguage}
//         onChange={(e) => setTargetLanguage(e.target.value)}
//         style={{
//           padding: '8px 12px',
//           border: '1px solid #374151',
//           borderRadius: '6px',
//           backgroundColor: '#1f2937',
//           color: '#fff',
//           fontSize: '14px'
//         }}
//       >
//         <option value="ur">Urdu</option>
//         <option value="en">English</option>
//         <option value="es">Spanish</option>
//         <option value="fr">French</option>
//         <option value="de">German</option>
//       </select>

//       <button
//         onClick={handleTranslate}
//         disabled={isLoading}
//         style={{
//           padding: '8px 16px',
//           backgroundColor: isLoading ? '#9ca3af' : '#10b981',
//           color: 'white',
//           border: 'none',
//           borderRadius: '6px',
//           cursor: isLoading ? 'not-allowed' : 'pointer',
//           fontSize: '14px',
//           fontWeight: '500'
//         }}
//       >
//         {isLoading ? "Translating..." : "Translate"}
//       </button>
//     </div>
//   );
// };

// export default TranslateButton;
"use client"

import { useState } from "react"

const TranslateButton = ({ chapterPath, rawContent, selectedText, onTranslated, getContent }) => {
  const [targetLanguage, setTargetLanguage] = useState("ur")
  const [isLoading, setIsLoading] = useState(false)

  const handleTranslate = async () => {
    setIsLoading(true)

    try {
      const contentToTranslate = getContent ? getContent() : rawContent

      const res = await fetch("https://bashartc14-robotics-book.hf.space/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter_path: chapterPath,
          raw_md: contentToTranslate || rawContent,
          selected_text: selectedText || "",
          target_language: targetLanguage,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || `HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      onTranslated(data.translated_md, targetLanguage) // Pass the target language
    } catch (error) {
      console.error("Translation error:", error)
      alert(`Translation failed: ${error.message || "Please try again"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "14px",
        alignItems: "center",
        padding: "14px 18px",
        background: "rgba(10, 10, 15, 0.95)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(14, 165, 233, 0.2)",
        borderRadius: "14px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.9), 0 0 16px rgba(14, 165, 233, 0.2)",
      }}
    >
      <select
        value={targetLanguage}
        onChange={(e) => setTargetLanguage(e.target.value)}
        style={{
          padding: "12px 18px",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "10px",
          background: "rgba(17, 17, 22, 0.8)",
          color: "#ffffff",
          fontSize: "0.95rem",
          cursor: "pointer",
          transition: "all 0.3s ease",
          fontWeight: "500",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#0ea5e9"
          e.currentTarget.style.background = "rgba(17, 17, 22, 0.95)"
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(14, 165, 233, 0.15)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"
          e.currentTarget.style.background = "rgba(17, 17, 22, 0.8)"
          e.currentTarget.style.boxShadow = "none"
        }}
      >
        <option value="ur" style={{ background: "#0a0a0f" }}>
          Urdu
        </option>
        <option value="en" style={{ background: "#0a0a0f" }}>
          English
        </option>
        <option value="es" style={{ background: "#0a0a0f" }}>
          Spanish
        </option>
        <option value="fr" style={{ background: "#0a0a0f" }}>
          French
        </option>
        <option value="de" style={{ background: "#0a0a0f" }}>
          German
        </option>
      </select>

      <button
        onClick={handleTranslate}
        disabled={isLoading}
        style={{
          padding: "12px 28px",
          background: isLoading ? "#111116" : "linear-gradient(135deg, #0ea5e9, #06b6d4)",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontSize: "0.95rem",
          fontWeight: "600",
          transition: "all 0.3s ease",
          boxShadow: isLoading ? "none" : "0 4px 16px rgba(14, 165, 233, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
          opacity: isLoading ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow =
              "0 8px 24px rgba(14, 165, 233, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow =
              "0 4px 16px rgba(14, 165, 233, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
          }
        }}
      >
        {isLoading ? "Translating..." : "Translate"}
      </button>
    </div>
  )
}

export default TranslateButton
