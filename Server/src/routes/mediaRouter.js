import express from 'express';
import {
    getRecentHeatmap, getHeatmaps,
    addHeatmap, uploadVideo, 
    deleteHeatmaps, deleteVideo,
    test, getJobs
} from '../controllers/mediaController.js';

const router = express.Router();

router.post('/heatmap', getRecentHeatmap);
router.post('/heatmap/byDates', getHeatmaps);
router.post('/heatmap/add', addHeatmap);
router.delete('/heatmap/delete', deleteHeatmaps);
router.post('/video/upload', uploadVideo);
router.delete('/video/delete', deleteVideo);
router.post('/video/test', test);
router.post('/jobs', getJobs);
export default router;