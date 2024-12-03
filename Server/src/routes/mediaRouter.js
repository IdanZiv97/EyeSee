import express from 'express';
import { getRecentHeatmap, getHeatmaps, deleteHeatmaps, deleteVideo } from '../controllers/mediaController.js';

const router = express.Router();

router.post('/heatmap', getRecentHeatmap);
router.post('/heatmap/byDates', getHeatmaps);
router.delete('/heatmap/delete', deleteHeatmaps);
router.delete('/video/delete', deleteVideo);
export default router;