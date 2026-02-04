import express from 'express';
import {
    getExpenses,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    exportExpensesCSV
} from '../controllers/expenseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, getExpenses)
    .post(protect, createExpense);

router.get('/export/csv', protect, exportExpensesCSV);

router.route('/:id')
    .get(protect, getExpense)
    .put(protect, updateExpense)
    .delete(protect, deleteExpense);

export default router;
