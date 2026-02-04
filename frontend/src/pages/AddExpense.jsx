import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { expenseService, categoryService } from '../services/expenseService';
import toast from 'react-hot-toast';

const AddExpense = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        paymentMethod: 'Cash'
    });

    useEffect(() => {
        fetchCategories();
        if (id) fetchExpense();
    }, [id]);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data.categories);
        } catch (error) {
            toast.error('Failed to load categories');
        }
    };

    const fetchExpense = async () => {
        try {
            const data = await expenseService.getExpense(id);
            const expense = data.expense;
            setFormData({
                title: expense.title,
                amount: expense.amount,
                category: expense.category._id,
                date: new Date(expense.date).toISOString().split('T')[0],
                description: expense.description || '',
                paymentMethod: expense.paymentMethod
            });
        } catch (error) {
            toast.error('Failed to load expense');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await expenseService.updateExpense(id, formData);
                toast.success('Expense updated successfully');
            } else {
                await expenseService.createExpense(formData);
                toast.success('Expense added successfully');
            }
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save expense');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-12">
            <div className="mb-10">
                <h2 className="text-candy-purple dark:text-purple-300 font-bold text-sm uppercase tracking-widest mb-1">
                    {id ? 'Edit Sweet Spend' : 'New Treat'}
                </h2>
                <h1 className="text-5xl font-outfit font-black text-[#2d2d4a] dark:text-white">
                    {id ? 'Update Expense' : 'Add New Expense'}
                </h1>
            </div>

            <div className="glass-candy rounded-[3rem] p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount Input - Large and Centered */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-baseline gap-2 relative">
                            <span className="text-4xl font-black text-candy-pink">$</span>
                            <input
                                className="w-48 bg-transparent border-none text-7xl font-outfit font-black text-[#2d2d4a] dark:text-white focus:ring-0 p-0 text-center outline-none"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                        </div>
                        <p className="text-sm font-bold text-gray-400 dark:text-purple-300 mt-4 uppercase tracking-widest">
                            How much did you spend?
                        </p>
                    </div>

                    {/* Title */}
                    <input
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-candy-pink focus:outline-none font-medium"
                        placeholder="Expense Title (e.g., Grocery Shopping)"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />

                    {/* Category Selection */}
                    <div className="mb-10">
                        <p className="text-sm font-bold text-[#4a4a6a] dark:text-purple-200 mb-6 px-2">Pick a category</p>
                        <div className="grid grid-cols-4 gap-6">
                            {categories.map((cat) => (
                                <div
                                    key={cat._id}
                                    onClick={() => setFormData({ ...formData, category: cat._id })}
                                    className={`flex flex-col items-center gap-2 group cursor-pointer ${formData.category === cat._id ? 'scale-110' : ''
                                        }`}
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-md hover:scale-110 transition-transform ${formData.category === cat._id
                                        ? 'bg-candy-pink/20 border-candy-pink'
                                        : 'bg-white border-white'
                                        }`}>
                                        <span className="text-3xl">{cat.icon}</span>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-600 dark:text-purple-200">{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Date and Payment Method */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-candy-pink focus:outline-none font-medium"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />

                        <select
                            value={formData.paymentMethod}
                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-candy-pink focus:outline-none font-medium"
                        >
                            <option value="Cash">💵 Cash</option>
                            <option value="Card">💳 Card</option>
                            <option value="Online">🌐 Online</option>
                        </select>
                    </div>

                    {/* Description */}
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="4"
                        placeholder="Add any notes about this expense..."
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-candy-pink focus:outline-none font-medium"
                    />

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-5 bg-gradient-to-r from-candy-pink to-candy-purple text-white rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : id ? 'Update Expense' : 'Add Expense'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 py-5 bg-white/60 dark:bg-slate-700 rounded-2xl font-bold text-[#2d2d4a] dark:text-white hover:bg-white dark:hover:bg-slate-600 transition-all border-2 border-white dark:border-slate-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpense;
