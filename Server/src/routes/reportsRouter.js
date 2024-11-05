import express from 'express';
import { createReport } from '../controllers/reportController.js';

const router = express.Router();

router.post('/report/create', createReport);

export default router;