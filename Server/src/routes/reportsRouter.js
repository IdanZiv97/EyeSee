import express from 'express';
import { createReport, defaultReport } from '../controllers/reportController.js';

const router = express.Router();

router.post('/report', defaultReport);
router.post('/report/create', createReport);

export default router;