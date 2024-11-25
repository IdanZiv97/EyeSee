import express from 'express';
import { getAverageDwellTimeWeekly } from "../controllers/dashboardController.js"

const router = express.Router();
router.post('/api/dwell-time/weekly', getAverageDwellTimeWeekly);

export default router;