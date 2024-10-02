import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Corrected import

const Chat = () => {
  const locationState = useLocation().state;
  const { bookingId, conversationId } = locationState;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);

  // Decode token to get the logged-in user's ID (whether it's a provider or customer)
  const token = Cookies.get("token");
  const decodedToken = token ? jwtDecode(token) : null; // Corrected usage
  const loggedInUserId = decodedToken?.id;

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3300");
    }

    socketRef.current.emit("joinConversation", conversationId);

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3300/api/v1/chat/messages/${conversationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    socketRef.current.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveConversation", conversationId);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [conversationId, token]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        conversationId,
        senderId: loggedInUserId, // Use the decoded token ID as the sender
        content: newMessage,
      };

      socketRef.current.emit("sendMessage", messageData);
      axios.post("http://localhost:3300/api/v1/chat/message", messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderId === loggedInUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg text-white max-w-xs md:max-w-md break-words ${
                  msg.senderId === loggedInUserId
                    ? "bg-blue-500 text-right"
                    : "bg-gray-300 text-left"
                }`}
              >
                <p>{msg.content}</p>
                <small className="block text-xs text-gray-200 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 sticky bottom-0 w-full">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
