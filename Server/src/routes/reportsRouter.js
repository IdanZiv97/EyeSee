import express from 'express';
import { createReport, defaultReport, qureyReportByDate} from '../controllers/reportController.js';

const router = express.Router();

router.post('/report', defaultReport);
router.post('/report/byDate', qureyReportByDate);
router.post('/report/create', createReport);

export default router;