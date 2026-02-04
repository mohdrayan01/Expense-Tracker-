import Expense from '../models/Expense.js';
import Category from '../models/Category.js';

// @desc    Get smart spending tip based on user patterns
// @route   GET /api/tips/smart
// @access  Private
export const getSmartTip = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get user's expenses from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentExpenses = await Expense.find({
            user: userId,
            date: { $gte: sevenDaysAgo }
        }).populate('category');

        if (recentExpenses.length === 0) {
            return res.json({
                success: true,
                tip: {
                    message: "Start tracking your expenses to get personalized tips! 🎯",
                    category: null,
                    amount: 0,
                    suggestion: "Add your first expense to begin your savings journey.",
                    icon: "💡"
                }
            });
        }

        // Calculate spending by category
        const categorySpending = {};
        let totalSpent = 0;

        recentExpenses.forEach(expense => {
            const categoryName = expense.category.name;
            if (!categorySpending[categoryName]) {
                categorySpending[categoryName] = {
                    total: 0,
                    count: 0,
                    icon: expense.category.icon,
                    categoryId: expense.category._id
                };
            }
            categorySpending[categoryName].total += expense.amount;
            categorySpending[categoryName].count += 1;
            totalSpent += expense.amount;
        });

        // Find highest spending category
        let highestCategory = null;
        let highestAmount = 0;

        for (const [category, data] of Object.entries(categorySpending)) {
            if (data.total > highestAmount) {
                highestAmount = data.total;
                highestCategory = { name: category, ...data };
            }
        }

        // Generate tip based on highest spending category
        let tip = generateTipForCategory(highestCategory, totalSpent);

        res.json({
            success: true,
            tip
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Helper function to generate tips
function generateTipForCategory(category, totalSpent) {
    const percentage = Math.round((category.total / totalSpent) * 100);

    const tips = {
        'Food': {
            message: `Sunny! You've spent $${category.total.toFixed(0)} on food this week. Switch to home cooking and afford that concert ticket!`,
            suggestion: "Set Meal Prep Goal",
            icon: "🍔"
        },
        'Transport': {
            message: `You've spent $${category.total.toFixed(0)} on transport this week. Consider carpooling or public transit to save more!`,
            suggestion: "Set Transport Budget",
            icon: "🚗"
        },
        'Shopping': {
            message: `Shopping total: $${category.total.toFixed(0)} this week! Create a wishlist and wait 24h before buying to avoid impulse purchases.`,
            suggestion: "Set Shopping Limit",
            icon: "🛒"
        },
        'Entertainment': {
            message: `Entertainment spending at $${category.total.toFixed(0)}! Look for free events or student discounts to enjoy more for less.`,
            suggestion: "Find Free Events",
            icon: "🎮"
        },
        'Bills': {
            message: `Bills: $${category.total.toFixed(0)} this week. Review subscriptions - you might be paying for services you don't use!`,
            suggestion: "Review Subscriptions",
            icon: "💡"
        },
        'Health': {
            message: `Health expenses: $${category.total.toFixed(0)}. Great investment! Consider preventive care to reduce future costs.`,
            suggestion: "Set Wellness Goal",
            icon: "⚕️"
        },
        'Others': {
            message: `Miscellaneous spending: $${category.total.toFixed(0)}. Track specific categories to identify savings opportunities!`,
            suggestion: "Categorize Better",
            icon: "📝"
        }
    };

    const defaultTip = {
        message: `Your ${category.name} spending is $${category.total.toFixed(0)} (${percentage}% of total). Consider setting a budget to save more!`,
        suggestion: "Set Budget Goal",
        icon: category.icon
    };

    return {
        ...defaultTip,
        ...(tips[category.name] || {}),
        category: category.name,
        amount: category.total,
        percentage
    };
}
