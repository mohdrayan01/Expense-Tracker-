import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, History, PieChart, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/add-expense', label: 'Add Expense', icon: TrendingUp },
        { path: '/history', label: 'History', icon: History },
        { path: '/analytics', label: 'Analytics', icon: PieChart },
        { path: '/profile', label: 'Profile', icon: User }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 shadow-2xl z-50 md:hidden"
                    >
                        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <nav className="p-4 space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={onClose}
                                        className={`
                      flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive
                                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                            }
                    `}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Sidebar;
