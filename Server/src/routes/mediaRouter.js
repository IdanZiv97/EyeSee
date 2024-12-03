import express from 'express';
import { getRecentHeatmap, getHeatmaps } from '../controllers/mediaController.js';

const router = express.Router();

router.post('/heatmap', getRecentHeatmap);
router.post('/heatmap/byDates', getHeatmaps);

export default router;