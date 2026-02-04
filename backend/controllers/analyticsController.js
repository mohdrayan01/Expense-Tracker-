import Expense from '../models/Expense.js';
import Category from '../models/Category.js';

// @desc    Get overall summary
// @route   GET /api/analytics/summary
// @access  Private
export const getSummary = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id });

        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalTransactions = expenses.length;

        // Current month expenses
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthExpenses = expenses.filter(e => e.date >= monthStart);
        const monthlyTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        // Last month expenses
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const lastMonthExpenses = expenses.filter(e => e.date >= lastMonthStart && e.date <= lastMonthEnd);
        const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        const monthlyChange = lastMonthTotal > 0
            ? ((monthlyTotal - lastMonthTotal) / lastMonthTotal) * 100
            : 0;

        res.json({
            success: true,
            summary: {
                totalExpenses,
                totalTransactions,
                monthlyTotal,
                monthlyChange: Math.round(monthlyChange * 10) / 10,
                averageTransaction: totalTransactions > 0 ? totalExpenses / totalTransactions : 0
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get monthly breakdown
// @route   GET /api/analytics/monthly
// @access  Private
export const getMonthlyBreakdown = async (req, res) => {
    try {
        const { year = new Date().getFullYear() } = req.query;

        const expenses = await Expense.find({
            user: req.user._id,
            date: {
                $gte: new Date(year, 0, 1),
                $lte: new Date(year, 11, 31)
            }
        });

        const monthlyData = Array(12).fill(0).map((_, index) => {
            const monthExpenses = expenses.filter(e => e.date.getMonth() === index);
            const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            return {
                month: new Date(year, index).toLocaleString('default', { month: 'short' }),
                total,
                count: monthExpenses.length
            };
        });

        res.json({ success: true, monthlyData });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get category-wise statistics
// @route   GET /api/analytics/category-wise
// @access  Private
export const getCategoryWise = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = { user: req.user._id };
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const expenses = await Expense.find(query).populate('category', 'name icon color');
        const categories = await Category.find({ user: req.user._id });

        const categoryStats = categories.map(category => {
            const categoryExpenses = expenses.filter(e => e.category._id.toString() === category._id.toString());
            const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            return {
                category: {
                    id: category._id,
                    name: category.name,
                    icon: category.icon,
                    color: category.color
                },
                total,
                count: categoryExpenses.length,
                percentage: 0 // Will be calculated after
            };
        }).filter(stat => stat.total > 0);

        // Calculate percentages
        const totalAmount = categoryStats.reduce((sum, stat) => sum + stat.total, 0);
        categoryStats.forEach(stat => {
            stat.percentage = totalAmount > 0 ? Math.round((stat.total / totalAmount) * 100) : 0;
        });

        // Sort by total descending
        categoryStats.sort((a, b) => b.total - a.total);

        res.json({ success: true, categoryStats });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get spending trends
// @route   GET /api/analytics/trends
// @access  Private
export const getTrends = async (req, res) => {
    try {
        const now = new Date();
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const expenses = await Expense.find({
            user: req.user._id,
            date: { $gte: last30Days }
        }).sort({ date: 1 });

        // Group by day
        const dailyData = {};
        expenses.forEach(expense => {
            const dateKey = expense.date.toISOString().split('T')[0];
            if (!dailyData[dateKey]) {
                dailyData[dateKey] = { date: dateKey, total: 0, count: 0 };
            }
            dailyData[dateKey].total += expense.amount;
            dailyData[dateKey].count += 1;
        });

        const trends = Object.values(dailyData).sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );

        res.json({ success: true, trends });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
