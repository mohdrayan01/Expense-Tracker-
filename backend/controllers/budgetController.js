import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user._id }).populate('category', 'name icon color');
        res.json({ success: true, budgets });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Create budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req, res) => {
    try {
        const budget = await Budget.create({
            ...req.body,
            user: req.user._id
        });
        const populatedBudget = await budget.populate('category', 'name icon color');
        res.status(201).json({ success: true, budget: populatedBudget });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res) => {
    try {
        let budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ success: false, message: 'Budget not found' });
        }

        // Check ownership
        if (budget.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        budget = await Budget.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('category', 'name icon color');

        res.json({ success: true, budget });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ success: false, message: 'Budget not found' });
        }

        // Check ownership
        if (budget.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await budget.deleteOne();
        res.json({ success: true, message: 'Budget deleted' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get budget status
// @route   GET /api/budgets/status
// @access  Private
export const getBudgetStatus = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user._id }).populate('category', 'name icon color');

        const budgetStatus = await Promise.all(budgets.map(async (budget) => {
            // Calculate spent amount based on budget period
            const now = new Date();
            let startDate = budget.startDate;
            let endDate = budget.endDate || now;

            if (budget.period === 'monthly') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            }

            const query = {
                user: req.user._id,
                date: { $gte: startDate, $lte: endDate }
            };

            if (budget.category) {
                query.category = budget.category._id;
            }

            const expenses = await Expense.find(query);
            const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const remaining = budget.amount - spent;
            const percentageUsed = (spent / budget.amount) * 100;

            return {
                budget: budget,
                spent,
                remaining,
                percentageUsed: Math.round(percentageUsed),
                isOverBudget: spent > budget.amount,
                isNearLimit: percentageUsed >= budget.alertThreshold
            };
        }));

        res.json({ success: true, budgetStatus });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
