import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) return res.status(400).json({ message: "Invalid data" });

  let message = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
  });

  message = await message.populate("sender", "name");
  message = await message.populate("chat");
  message = await User.populate(message, { path: "chat.users", select: "name email" });

  await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

  res.status(201).json(message);
};

export const allMessages = async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "name email")
    .populate("chat");
  res.json(messages);
};
