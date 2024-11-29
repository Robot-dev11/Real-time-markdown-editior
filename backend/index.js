const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const marked = require("marked");

const app = express();
const PORT = 3000;

// Create an HTTP server
const server = http.createServer(app);

// Attach Socket.IO to the server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (use specific origins in production)
  },
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Listen for a custom event
  socket.on("markdown", (markdownText) => {
    try {
        const html = marked.parse(markdownText);
        socket.emit("html", html);
      } catch (error) {
        socket.emit("error", "Error converting markdown");
      }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
