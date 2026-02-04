import express from 'express';
import {
    getSummary,
    getMonthlyBreakdown,
    getCategoryWise,
    getTrends
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/summary', protect, getSummary);
router.get('/monthly', protect, getMonthlyBreakdown);
router.get('/category-wise', protect, getCategoryWise);
router.get('/trends', protect, getTrends);

export default router;
