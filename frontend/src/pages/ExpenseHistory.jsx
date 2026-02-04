import { useState, useEffect } from 'react';
import { expenseService, categoryService } from '../services/expenseService';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const ExpenseHistory = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchCategories();
        fetchExpenses();
    }, [filters]);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data.categories);
        } catch (error) {
            toast.error('Failed to load categories');
        }
    };

    const fetchExpenses = async () => {
        try {
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.category) params.category = filters.category;
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;

            const data = await expenseService.getExpenses(params);
            setExpenses(data.expenses);
        } catch (error) {
            toast.error('Failed to load expenses');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) return;
        try {
            await expenseService.deleteExpense(id);
            toast.success('Expense deleted');
            fetchExpenses();
        } catch (error) {
            toast.error('Failed to delete expense');
        }
    };

    const handleExport = async () => {
        try {
            const blob = await expenseService.exportCSV();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'expenses.csv';
            a.click();
            toast.success('Expenses exported');
        } catch (error) {
            toast.error('Failed to export expenses');
        }
    };

    if (loading) return <Loader size="lg" className="h-screen" />;

    return (
        <div className="max-w-5xl mx-auto p-6 md:p-12">
            {/* Header */}
            <header className="flex flex-col gap-8 mb-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-candy-purple font-bold text-sm uppercase tracking-widest mb-1">
                            Your Spending Journey
                        </h2>
                        <h1 className="text-5xl font-outfit font-black text-[#2d2d4a] dark:text-white">
                            Transaction History
                        </h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="glass-candy flex items-center px-6 py-4 rounded-full min-w-[300px]">
                            <span className="material-symbols-outlined text-gray-400 mr-3">search</span>
                            <input
                                className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full text-[#4a4a6a] dark:text-white outline-none"
                                placeholder="Search treats..."
                                type="text"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                        <button
                            onClick={handleExport}
                            className="w-16 h-16 bg-gradient-to-tr from-candy-pink to-candy-purple text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        >
                            <span className="material-symbols-outlined text-3xl font-bold">download</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Filter Row */}
            <div className="glass-candy rounded-3xl p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-candy-pink focus:outline-none font-medium"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.icon} {cat.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-candy-pink focus:outline-none font-medium"
                    />

                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-candy-pink focus:outline-none font-medium"
                    />
                </div>
            </div>

            {/* Expenses List */}
            <div className="space-y-6">
                {expenses.length > 0 ? (
                    <>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4 mb-4">
                            Recent Transactions
                        </h3>
                        {expenses.map((expense) => (
                            <div
                                key={expense._id}
                                className="glass-candy rounded-3xl p-6 flex items-center gap-6 group hover:bg-white cursor-pointer transition-all"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-candy-pink/10 flex items-center justify-center border-2 border-white overflow-hidden">
                                    <span className="text-4xl">{expense.category?.icon || '🍰'}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-lg text-[#2d2d4a] dark:text-white">{expense.title}</h4>
                                    <p className="text-sm text-gray-400 font-medium">
                                        {expense.category?.name || 'Other'}
                                    </p>
                                    {expense.description && (
                                        <p className="text-sm text-gray-500 dark:text-purple-300 mt-1">{expense.description}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-[#2d2d4a] dark:text-white">-${expense.amount.toFixed(2)}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                                        {new Date(expense.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/edit-expense/${expense._id}`)}
                                        className="p-3 rounded-2xl bg-candy-blue/10 text-candy-blue hover:bg-candy-blue/20 transition-all"
                                    >
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(expense._id)}
                                        className="p-3 rounded-2xl bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="glass-candy rounded-3xl p-12 text-center">
                        <span className="material-symbols-outlined text-[8rem] text-gray-300 mb-4">receipt_long</span>
                        <p className="text-gray-500 dark:text-purple-300 text-lg font-medium">
                            No expenses found. Start tracking by adding your first treat! 🍭
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseHistory;
