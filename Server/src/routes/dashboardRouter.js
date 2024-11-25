import express from 'express';
import { getAverageDwellTimeWeekly, getAverageDwellTimeMonthly, getMonthlyTotalCustomers } from "../controllers/dashboardController.js"

const router = express.Router();
router.post('/api/dwell-time/weekly', getAverageDwellTimeWeekly);
router.post('/api/dwell-time/monthly', getAverageDwellTimeMonthly);
router.post('/api/customers/monthly', getMonthlyTotalCustomers);

export default router;