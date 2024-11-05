import express from "express";
import { createUser } from "../controllers/userController.js";

const router = express.Router();

//Route to for signup
router.post('/signup', createUser);

export default router;
