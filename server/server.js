import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
connectDB(process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("setup", (userData) => {
    onlineUsers[userData._id] = socket.id;
    socket.emit("connected");
    console.log(`User setup done: ${userData._id}`);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("new message", (newMessage) => {
    const chat = newMessage.chat;
    if (!chat?.users) return;

    // Send message to everyone in room except sender
    socket.to(chat._id).emit("message received", newMessage);
  });

  socket.on("disconnect", () => {
    for (const [userId, sId] of Object.entries(onlineUsers)) {
      if (sId === socket.id) {
        delete onlineUsers[userId];
      }
    }
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
