import express from 'express';
import { createReport, defaultReport, qureyReportByDate, qureyReportByDates, qureyReportByGender, qureyReportByAges} from '../controllers/reportController.js';
import { deleteReport, deleteReports } from '../controllers/reportController.js';
const router = express.Router();

router.post('/report', defaultReport);
router.post('/report/byDate', qureyReportByDate);
router.post('/report/byDates', qureyReportByDates);
router.post('/report/byGender', qureyReportByGender);
router.post('/report/byAges', qureyReportByAges);
router.post('/report/create', createReport);
router.delete('/report/del', deleteReport);
router.delete('/report/delReports', deleteReports);
export default router;