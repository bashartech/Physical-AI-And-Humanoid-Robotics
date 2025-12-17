
import React from "react";
import { useAuth } from "../context/AuthContext";

const PersonalizeButton = ({ chapterPath, rawContent, onPersonalized }) => {
  const { isAuth } = useAuth();

  const handleClick = async () => {
    if (!isAuth) {
      window.location.href = "http://localhost:3000/login";
      return;
    }

    const res = await fetch("https://bashartc14-robotics-book.hf.space/personalize", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapter_path: chapterPath, raw_md: rawContent }),
    });

    const data = await res.json();
    onPersonalized(data.personalized_md);
  };

  return <button onClick={handleClick}>Personalize</button>;
};

export default PersonalizeButton;
