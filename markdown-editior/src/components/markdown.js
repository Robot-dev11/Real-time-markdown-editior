import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); 

function MarkdownEditior() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");

  useEffect(() => {
    // Listen for the converted HTML from the server
    socket.on("html", (data) => {
        setHtml(data);
    });

    // Handle errors from the server
    socket.on("error", (error) => {
      console.error("Error from server:", error);
    });
    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.off("html");
      socket.off("error");
    };
  }, []);

  const handleMarkdownChange = (e) => {
    const markdownText = e.target.value;
    setMarkdown(markdownText);
    socket.emit("markdown", markdownText);
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* Markdown Editor */}
      <textarea
        value={markdown}
        onChange={handleMarkdownChange}
        placeholder="Type your Markdown here..."
        style={{
          width: "50%",
          height: "400px",
          fontSize: "16px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      ></textarea>

      {/* HTML Preview */}
      <div
        style={{
          width: "50%",
          height: "400px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          background: "#f9f9f9",
          overflow: "auto",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </div>
  );
}

export default MarkdownEditior;