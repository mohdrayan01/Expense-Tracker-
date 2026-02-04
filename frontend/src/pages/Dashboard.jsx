import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { analyticsService, expenseService, budgetService } from '../services/expenseService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import SmartTip from '../components/dashboard/SmartTip';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [categoryData, setCategoryData] = useState([]);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [budgetStatus, setBudgetStatus] = useState([]);

    useEffect(() => {
        fetchDashboardData();

        // Refresh dashboard when window gets focus (e.g., coming back from Profile)
        const handleFocus = () => {
            fetchDashboardData();
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [summaryRes, categoryRes, expensesRes, budgetRes] = await Promise.all([
                analyticsService.getSummary(),
                analyticsService.getCategoryWise(),
                expenseService.getExpenses({ limit: 5 }),
                budgetService.getBudgetStatus()
            ]);
            setSummary(summaryRes.summary);
            setCategoryData(categoryRes.categoryStats);
            setRecentExpenses(expensesRes.expenses);
            setBudgetStatus(budgetRes.budgetStatus);
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader size="lg" className="h-screen" />;

    // Use user's monthly budget from profile preferences
    const userMonthlyBudget = user?.preferences?.monthlyBudget || 0;
    const totalBudget = userMonthlyBudget > 0 ? userMonthlyBudget : budgetStatus.reduce((acc, status) => acc + status.budget.amount, 0);
    const totalSpent = summary?.monthlyTotal || 0;
    const budgetPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
    const budgetRemaining = totalBudget - totalSpent;

    return (
        <div className="flex-1 flex flex-col p-6 pt-16 md:p-8 md:pt-20 md:ml-48">
            {/* Header */}
            <header className="flex justify-between items-center mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-2xl">
                            👋
                        </div>
                        <h2 className="text-candy-pink font-bold text-sm uppercase tracking-[0.2em]">
                            Hey there, Sweet Tooth!
                        </h2>
                    </div>
                    <h1 className="text-6xl font-outfit font-black text-[#2d2d4a] dark:text-purple-100 tracking-tight">
                        Playful Dashboard
                    </h1>
                </div>
                <div className="flex gap-6 items-center">
                    <div className="w-16 h-16 rounded-[2rem] bg-white border-2 border-white shadow-lg overflow-hidden flex items-center justify-center cursor-pointer hover:rotate-12 transition-all">
                        <span className="text-3xl">😊</span>
                    </div>
                </div>
            </header>

            {/* Balance Card */}
            <div className="balance-card p-12 mb-10 overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <span className="bg-white/60 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest text-candy-pink shadow-sm">
                            Your Candy Jar
                        </span>
                        <h2 className="text-7xl font-outfit font-black text-[#2d2d4a] dark:text-purple-100 mt-6 tracking-tight">
                            ${summary?.totalExpenses?.toFixed(2) || '0.00'}
                            <span className="text-candy-purple text-5xl">.00</span>
                        </h2>
                        <div className="mt-8 flex items-center gap-4">
                            <div className="px-5 py-2 bg-candy-mint/20 text-[#15803d] font-bold rounded-full text-sm flex items-center gap-2 border border-candy-mint/30">
                                <span className="material-symbols-outlined text-lg">trending_up</span>
                                +{Math.abs(summary?.monthlyChange || 0).toFixed(1)}% Monthly Grow
                            </div>
                            <Link to="/analytics">
                                <button className="px-8 py-3 bg-white/60 rounded-full font-bold text-sm hover:bg-white transition-all shadow-sm border border-white">
                                    View Details
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Dollar Coin Icon */}
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-candy-pink/20 to-candy-blue/20 rounded-full blur-3xl"></div>
                            <span className="material-symbols-outlined text-[10rem] text-candy-orange drop-shadow-[0_25px_25px_rgba(255,170,51,0.5)] floating-3d select-none">
                                monetization_on
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    {/* Recent Treats */}
                    <div className="glass-candy rounded-[3rem] p-10 flex flex-col">
                        <h3 className="text-2xl font-outfit font-black text-[#2d2d4a] dark:text-purple-100 mb-8">Recent Treats</h3>
                        <div className="space-y-6">
                            {recentExpenses.length > 0 ? (
                                recentExpenses.map((expense) => (
                                    <div key={expense._id} className="flex items-center gap-5 group cursor-pointer hover:translate-x-1 transition-transform">
                                        <div className="w-14 h-14 rounded-2xl bg-candy-pink/10 flex items-center justify-center text-candy-pink border-2 border-white shadow-md">
                                            <span className="text-2xl">{expense.category?.icon || '🍰'}</span>
                                        </div>
                                        <div className="flex-1 flex justify-between">
                                            <div>
                                                <p className="font-bold text-[#2d2d4a] dark:text-purple-100">{expense.title}</p>
                                                <p className="text-xs text-gray-400 dark:text-purple-300">{expense.category?.name || 'Other'}</p>
                                            </div>
                                            <p className="font-black text-candy-pink">-${expense.amount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 dark:text-purple-300 text-center py-8">No expenses yet! Start adding some treats 🍭</p>
                            )}
                        </div>
                        <Link to="/history">
                            <button className="mt-8 text-sm font-bold text-candy-pink hover:underline">
                                View all transactions
                            </button>
                        </Link>
                    </div>

                    {/* Budget Melt */}
                    <div className="glass-candy rounded-[3rem] p-10">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-outfit font-black text-[#2d2d4a] dark:text-purple-100">Budget Melt</h3>
                                <p className="text-gray-400 dark:text-purple-300 font-medium text-sm">Monthly Sweet Allowance</p>
                            </div>
                            <span className="text-4xl font-black text-candy-pink">{budgetPercentage}%</span>
                        </div>

                        {/* Liquid Wave Progress */}
                        <div className="h-16 w-full liquid-wave-container border-4 border-white shadow-lg mb-8">
                            <div className="liquid-wave" style={{ width: `${Math.min(budgetPercentage, 100)}%` }}></div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-white/50 rounded-[2rem] border-2 border-white">
                                <p className="text-[10px] font-black text-gray-400 dark:text-purple-300 uppercase tracking-widest mb-1">Max Limit</p>
                                <p className="text-3xl font-outfit font-black text-[#2d2d4a] dark:text-purple-100">
                                    ${totalBudget > 0 ? totalBudget.toFixed(0) : '0'}
                                </p>
                            </div>
                            <div className="p-6 bg-white/50 rounded-[2rem] border-2 border-white">
                                <p className="text-[10px] font-black text-gray-400 dark:text-purple-300 uppercase tracking-widest mb-1">Sweet Left</p>
                                <p className={`text-3xl font-outfit font-black ${budgetRemaining >= 0 ? 'text-candy-mint' : 'text-red-500'}`}>
                                    ${Math.abs(budgetRemaining).toFixed(0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Smart Tip Widget */}
                <div className="mt-10">
                    <SmartTip />
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    <div className="glass-candy rounded-[2rem] p-6">
                        <p className="text-xs font-black text-gray-400 dark:text-purple-300 uppercase tracking-widest mb-2">This Month</p>
                        <p className="text-3xl font-outfit font-black text-[#2d2d4a] dark:text-purple-100">
                            ${summary?.monthlyTotal?.toFixed(2) || '0.00'}
                        </p>
                    </div>
                    <div className="glass-candy rounded-[2rem] p-6">
                        <p className="text-xs font-black text-gray-400 dark:text-purple-300 uppercase tracking-widest mb-2">Transactions</p>
                        <p className="text-3xl font-outfit font-black text-candy-blue">
                            {summary?.totalTransactions || 0}
                        </p>
                    </div>
                    <div className="glass-candy rounded-[2rem] p-6">
                        <p className="text-xs font-black text-gray-400 dark:text-purple-300 uppercase tracking-widest mb-2">Avg. Treat</p>
                        <p className="text-3xl font-outfit font-black text-candy-purple">
                            ${summary?.averageTransaction?.toFixed(2) || '0.00'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <Link to="/add-expense">
                <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-tr from-candy-pink to-candy-purple text-white shadow-2xl hover:scale-110 hover:shadow-pink-500/50 transition-all duration-300 flex items-center justify-center z-50 group animate-bounce-subtle">
                    <Plus size={32} strokeWidth={3} />

                    {/* Tooltip */}
                    <span className="absolute right-20 whitespace-nowrap bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        Add Expense
                    </span>
                </button>
            </Link>
        </div>
    );
};

export default Dashboard;
