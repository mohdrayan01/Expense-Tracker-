import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { analyticsService } from '../services/expenseService';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [trends, setTrends] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [monthly, category, trendData] = await Promise.all([
                analyticsService.getMonthlyBreakdown(new Date().getFullYear()),
                analyticsService.getCategoryWise(),
                analyticsService.getTrends()
            ]);
            setMonthlyData(monthly.monthlyData);
            setCategoryData(category.categoryStats);
            setTrends(trendData.trends);
        } catch (error) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

    if (loading) return <Loader size="lg" className="h-screen" />;

    return (
        <div className="min-h-screen p-4 pt-20 md:p-6 md:pt-24 lg:p-8 md:ml-32">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-candy-purple dark:text-purple-300 font-bold text-sm uppercase tracking-widest mb-1">
                        Data Insights
                    </h2>
                    <h1 className="text-5xl font-outfit font-black text-[#2d2d4a] dark:text-white mb-2">
                        Analytics
                    </h1>
                    <p className="text-gray-600 dark:text-purple-200 font-medium">
                        Insights into your spending patterns
                    </p>
                </div>

                {/* Monthly Breakdown */}
                <div className="glass-candy rounded-3xl p-8 mb-6 shadow-lg">
                    <h2 className="text-2xl font-black text-[#2d2d4a] dark:text-white mb-6">
                        Monthly Spending - {new Date().getFullYear()}
                    </h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: '#fff'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="total" fill="#ff6b9d" radius={[8, 8, 0, 0]} name="Amount ($)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category and Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Category Breakdown */}
                    <div className="glass-candy rounded-3xl p-8 shadow-lg">
                        <h2 className="text-2xl font-black text-[#2d2d4a] dark:text-white mb-6">
                            Category Breakdown
                        </h2>
                        {categoryData.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percentage }) => `${name} ${percentage}%`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="total"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 space-y-2">
                                    {categoryData.map((cat, index) => (
                                        <div key={cat.category.id} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className="w-4 h-4 rounded"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                                <span className="text-sm text-gray-700 dark:text-purple-200">
                                                    {cat.category.icon} {cat.category.name}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-pink-200">
                                                ${cat.total.toFixed(2)} ({cat.percentage}%)
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-400">
                                No category data available
                            </div>
                        )}
                    </div>

                    {/* Spending Trends */}
                    <div className="glass-candy rounded-3xl p-8 shadow-lg">
                        <h2 className="text-2xl font-black text-[#2d2d4a] dark:text-white mb-6">
                            Spending Trends (Last 30 Days)
                        </h2>
                        {trends.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={trends}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#9ca3af"
                                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: 'none',
                                            borderRadius: '12px',
                                            color: '#fff'
                                        }}
                                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        dot={{ fill: '#6366f1', r: 4 }}
                                        activeDot={{ r: 6 }}
                                        name="Amount ($)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-400">
                                No trend data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Categories */}
                {categoryData.length > 0 && (
                    <div className="glass-candy rounded-3xl p-8 shadow-lg">
                        <h2 className="text-2xl font-black text-[#2d2d4a] dark:text-white mb-6">
                            Top Spending Categories
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {categoryData.slice(0, 3).map((cat, index) => (
                                <div
                                    key={cat.category.id}
                                    className="p-4 rounded-xl"
                                    style={{ backgroundColor: COLORS[index] + '20' }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-3xl">{cat.category.icon}</span>
                                        <span className="text-2xl font-bold" style={{ color: COLORS[index] }}>
                                            #{index + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-purple-100 mb-1">
                                        {cat.category.name}
                                    </h3>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-pink-100">
                                        ${cat.total.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-purple-300">
                                        {cat.count} transactions
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
