import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client"; // Import socket.io-client
import axios from "axios";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const Chat = () => {
  const locationState = useLocation().state;
  const { bookingId, conversationId, userId, providerId } = locationState;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null); // Store socket reference

  useEffect(() => {
    // Establish the WebSocket connection only if not already connected
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3300");
    }

    // Join conversation room only once
    socketRef.current.emit("joinConversation", conversationId);

    // Fetch previous messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3300/api/v1/chat/messages/${conversationId}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    // Listen for incoming messages
    socketRef.current.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup: Leave the room and disconnect socket on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveConversation", conversationId); // Custom event to leave conversation
        socketRef.current.disconnect(); // Disconnect socket
        socketRef.current = null; // Clear socket reference
      }
    };
  }, [conversationId]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        conversationId,
        senderId: userId ? userId : providerId,
        content: newMessage,
      };

      // Send message via socket and to the backend
      socketRef.current.emit("sendMessage", messageData);
      axios.post("http://localhost:3300/api/v1/chat/message", messageData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      // Clear input field
      setNewMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.senderId === userId ? "sent" : "received"
            }`}
          >
            <p>{msg.content}</p>
            <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <div className="send-message">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
