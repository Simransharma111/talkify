import express from "express";
import { registerUser, authUser, getAllUsers } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", authUser);
router.get("/users", protect, getAllUsers); // fetch all users

export default router;
