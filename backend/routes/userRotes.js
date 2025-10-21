import express from "express";
import { getUser, loginUser, registerUser } from "../controllers/userController.js";

import { protect } from "../middlewares/authMiddleware.js";

const userRoutes = express.Router();


userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/profile",protect, getUser);


export default userRoutes;