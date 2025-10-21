import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

const API_URL = "http://localhost:5000/api"; // Change as needed
const SOCKET_URL = "http://localhost:5000";

export default function Chat() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId") || "exampleUserId123";

  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  const socketRef = useRef();
  const scrollRef = useRef(null);

  // Fetch all users except logged-in user
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Setup socket connection
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
      socketRef.current.emit("setup", { _id: userId });
      setSocketConnected(true);
    });

    socketRef.current.on("message received", (msg) => {
      if (selectedChat && msg.chat._id === selectedChat._id) {
        setMessages((prev) => [...prev, msg]);
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    });

    socketRef.current.on("disconnect", () => {
      setSocketConnected(false);
    });

    return () => {
      socketRef.current.disconnect();
      setSocketConnected(false);
    };
  }, [userId, selectedChat]);

  // Select user and fetch or create chat
  const selectUser = async (user) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/chat`,
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedChat(data);

      const msgRes = await axios.get(`${API_URL}/message/${data._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(msgRes.data);

      socketRef.current.emit("join chat", data._id);
    } catch (err) {
      console.error("Error selecting user:", err);
    }
  };

  // Send message handler
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedChat || !socketConnected) return;

    try {
      const { data } = await axios.post(
        `${API_URL}/message`,
        { content: newMessage, chatId: selectedChat._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, data]);
      setNewMessage("");
      socketRef.current.emit("new message", data);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex h-screen max-w-6xl mx-auto bg-white rounded shadow overflow-hidden">
      {/* User List Sidebar */}
      <div className="w-72 bg-gray-50 border-r border-gray-300 flex flex-col">
        <div className="p-5 text-xl font-bold border-b border-gray-200">
          Users
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.length === 0 ? (
            <div className="p-4 text-gray-500">No other users found</div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                onClick={() => selectUser(user)}
                className={`cursor-pointer p-4 border-b border-gray-200 hover:bg-blue-50 flex items-center gap-3 ${
                  selectedChat?.users?.some((u) => u._id === user._id)
                    ? "bg-blue-100 font-semibold"
                    : ""
                }`}
              >
                <div className="w-10 h-10 bg-blue-400 rounded-full flex-shrink-0" />
                <span>{user.name}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-5 border-b border-gray-300 font-semibold bg-gray-100">
              Chatting with:{" "}
              {selectedChat.users
                .filter((u) => u._id !== userId)
                .map((u) => u.name)
                .join(", ")}
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg._id || Math.random()}
                  ref={scrollRef}
                  className={`flex ${
                    msg.sender._id === userId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm break-words ${
                      msg.sender._id === userId
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1 select-none pointer-events-none">
                      {msg.sender._id === userId ? "You" : msg.sender.name}
                    </div>
                    <div>{msg.content}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-5 border-t border-gray-300 flex gap-4 items-center bg-white">
              <input
                type="text"
                placeholder={socketConnected ? "Type a message..." : "Connecting..."}
                disabled={!socketConnected}
                className="flex-1 border border-gray-300 px-4 py-2 rounded-full focus:ring-2 focus:ring-blue-600 focus:outline-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={!socketConnected || !newMessage.trim()}
                className={`px-6 py-2 rounded-full text-white ${
                  socketConnected
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 font-semibold text-lg">
            Select a user from the left to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
