import express from 'express';
import {
    getAverageDwellTimeWeekly, getAverageDwellTimeMonthly,
    getMonthlyTotalCustomers, getWeeklyTotalCustomers,
    getMonthlyTotalGenderDistribution, getWeeklyTotalGenderDistribution,
    getMonthlyTotalAgeDistribution
} from "../controllers/dashboardController.js"


const router = express.Router();
router.post('/api/dwell-time/weekly', getAverageDwellTimeWeekly);
router.post('/api/dwell-time/monthly', getAverageDwellTimeMonthly);
router.post('/api/customers/monthly', getMonthlyTotalCustomers);
router.post('/api/customers/weekly', getWeeklyTotalCustomers);
router.post('/api/gender-distribution/monthly', getMonthlyTotalGenderDistribution);
router.post('/api/gender-distribution/weekly', getWeeklyTotalGenderDistribution);
router.post('/api/age-distribution/monthly', getMonthlyTotalAgeDistribution);

export default router;