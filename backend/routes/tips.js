import express from 'express';
import { getSmartTip } from '../controllers/tipsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/smart', protect, getSmartTip);

export default router;
