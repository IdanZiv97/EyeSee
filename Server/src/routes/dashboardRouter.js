import express from 'express';
import { getAverageDwellTimeWeekly, getAverageDwellTimeMonthly } from "../controllers/dashboardController.js"

const router = express.Router();
router.post('/api/dwell-time/weekly', getAverageDwellTimeWeekly);
router.post('/api/dwell-time/monthly', getAverageDwellTimeMonthly);

export default router;