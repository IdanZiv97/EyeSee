import express from "express";
import { createStore, deleteStore, updateStore } from "../controllers/storeController.js";

const router = express.Router();

router.post('/store/create', createStore);
router.delete('/store/delete', deleteStore)
router.patch('/store/update', updateStore);
export default router;