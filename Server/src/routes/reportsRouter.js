import express from 'express';
import { createReport, defaultReport, qureyReportByDate, qureyReportByDates, qureyReportByGender, qureyReportByAges} from '../controllers/reportController.js';

const router = express.Router();

router.post('/report', defaultReport);
router.post('/report/byDate', qureyReportByDate);
router.post('/report/byDates', qureyReportByDates);
router.post('/report/byGender', qureyReportByGender);
router.post('/report/byAges', qureyReportByAges);
router.post('/report/create', createReport);

export default router;