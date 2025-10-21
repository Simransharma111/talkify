import { Router } from 'express';
const router = Router();
import auth from '../middleware/authMiddleware.js';
import Message, { find } from '../models/Message.js';

// GET /api/messages - last 100 messages
router.get('/', auth, async (req, res) => {
  const messages = await find().sort({ createdAt: 1 }).limit(100).populate('sender', 'name');
  res.json(messages);
});

// POST /api/messages - create a message
router.post('/', auth, async (req, res) => {
  const { text } = req.body;
  const message = new Message({ sender: req.user.id, text });
  await message.save();
  const populated = await message.populate('sender', 'name');
  res.json(populated);
});

export default router;
