import express from 'express';
import { getRecentHeatmap } from '../controllers/mediaController.js';

const router = express.Router();

router.post('/heatmap', getRecentHeatmap);

export default router;