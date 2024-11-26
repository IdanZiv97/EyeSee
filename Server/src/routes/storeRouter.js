import express from "express";
import { createStore, deleteStore } from "../controllers/storeController.js";

const router = express.Router();

router.post('/store/create', createStore);
router.delete('/store/delete', deleteStore)

export default router;