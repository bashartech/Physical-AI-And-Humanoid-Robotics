"use client"
import React, { useState, useEffect } from 'react';
import ReactMarkdown from "react-markdown";            // ⭐ ADD
import remarkGfm from "remark-gfm";                   // ⭐ ADD
import rehypeRaw from "rehype-raw";                   // ⭐ ADD

import styles from './ChatWidget.module.css';

const ChatWidget = ({ initialSelectedText = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState(initialSelectedText);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConstrained, setIsConstrained] = useState(false);

  useEffect(() => {
    setQuestion(initialSelectedText);
    setIsConstrained(!!initialSelectedText);
  }, [initialSelectedText]);

  useEffect(() => {
    if (initialSelectedText) {
      setChatHistory((prev) => [
        ...prev,
        { type: "user", text: initialSelectedText }
      ]);
      setQuestion(initialSelectedText);
      setIsConstrained(true);
      setIsOpen(true);
    }
  }, [initialSelectedText]);

  const toggleChat = () => setIsOpen(!isOpen);
  const handleQuestionChange = (e) => setQuestion(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { type: 'user', text: question };
    setChatHistory((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: question,
          selection_text: initialSelectedText
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const botMessage = { type: 'bot', text: data.answer };
      setChatHistory((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error('Chat API error:', error);
      setChatHistory((prev) => [
        ...prev,
        { type: 'bot', text: 'Error: Could not get a response. (backend not deploy)' }
      ]);
    } finally {
      setIsLoading(false);
      setQuestion('');
      setIsConstrained(false);
    }
  };

  return (
    <div className={styles.chatWidgetContainer}>
      <button onClick={toggleChat} className={styles.toggleButton}>💬</button>

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>AI Chatbot</h3>
            {isConstrained && (
              <span className={styles.constrainedBadge}>
                Answer constrained to selection
              </span>
            )}
            <button onClick={toggleChat} className={styles.closeButton}>×</button>
          </div>

          <div className={styles.chatBody}>
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`${styles.chatMessage} ${styles[msg.type]}`}>
                
                {/* ⭐ Markdown Renderer */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {msg.text}
                </ReactMarkdown>

              </div>
            ))}

            {isLoading && <div className={styles.loading}>Thinking...</div>}
          </div>

          <form onSubmit={handleSubmit} className={styles.chatInputForm}>
            <input
              type="text"
              value={question}
              onChange={handleQuestionChange}
              placeholder={isConstrained ? "Ask about the selected text..." : "Ask a question..."}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>Send</button>
          </form>

        </div>
      )}
    </div>
  );
};

export default ChatWidget;
