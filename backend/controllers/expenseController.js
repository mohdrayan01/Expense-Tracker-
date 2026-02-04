import Expense from '../models/Expense.js';

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, startDate, endDate, search } = req.query;

        // Build query
        const query = { user: req.user._id };

        if (category) query.category = category;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const expenses = await Expense.find(query)
            .populate('category', 'name icon color')
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Expense.countDocuments(query);

        res.json({
            success: true,
            expenses,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
export const getExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id).populate('category', 'name icon color');

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        // Check ownership
        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.json({ success: true, expense });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Create expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res) => {
    try {
        const expense = await Expense.create({
            ...req.body,
            user: req.user._id
        });

        const populatedExpense = await expense.populate('category', 'name icon color');

        res.status(201).json({ success: true, expense: populatedExpense });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        // Check ownership
        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        expense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('category', 'name icon color');

        res.json({ success: true, expense });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        // Check ownership
        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await expense.deleteOne();

        res.json({ success: true, message: 'Expense deleted' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Export expenses to CSV
// @route   GET /api/expenses/export/csv
// @access  Private
export const exportExpensesCSV = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id })
            .populate('category', 'name')
            .sort({ date: -1 });

        // Create CSV
        let csv = 'Date,Title,Amount,Category,Payment Method,Description\n';
        expenses.forEach(expense => {
            csv += `${expense.date.toISOString().split('T')[0]},${expense.title},${expense.amount},${expense.category.name},${expense.paymentMethod},"${expense.description}"\n`;
        });

        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=expenses.csv');
        res.send(csv);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
