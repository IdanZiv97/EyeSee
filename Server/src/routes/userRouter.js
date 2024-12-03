import express from "express";
import { createUser, updateUserInfo } from "../controllers/userController.js";

const router = express.Router();

//Route to for signup
router.post('/signup', createUser);
router.patch('/user-info', updateUserInfo)

export default router;
