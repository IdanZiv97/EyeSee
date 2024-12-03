import express from 'express';
import {
    getRecentHeatmap, getHeatmaps,
    addHeatmap,
    deleteHeatmaps, deleteVideo
} from '../controllers/mediaController.js';

const router = express.Router();

router.post('/heatmap', getRecentHeatmap);
router.post('/heatmap/byDates', getHeatmaps);
router.post('/heatmap/add',)
router.delete('/heatmap/delete', deleteHeatmaps);
router.delete('/video/delete', deleteVideo);
export default router;