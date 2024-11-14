import express from 'express';
import bcrypt from 'bcrypt';
import { loginUser } from '../controllers/authController.js';

const router = express.Router();

router.get('/login', loginUser);