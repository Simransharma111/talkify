import { findOne, create } from "../models/userModel";
import { sign } from "jsonwebtoken";

const generateToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register user
export async function registerUser(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const userExists = await findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const user = await create({ name, email, password });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
}

// Login user
export async function authUser(req, res) {
  const { email, password } = req.body;

  const user = await findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
}
