import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
    const { user, logout, isAuthenticated } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    if (!isAuthenticated) return null;

    return (
        <nav className="fixed left-6 top-6 bottom-6 w-24 lg:w-32 glass-candy rounded-[3.5rem] flex flex-col items-center py-12 gap-12 z-20 shadow-xl">
            {/* Logo */}
            <Link
                to="/dashboard"
                className="w-16 h-16 bg-gradient-to-br from-candy-pink to-candy-purple rounded-[1.5rem] flex items-center justify-center shadow-[0_10px_15px_rgba(255,133,161,0.4)] text-white hover:scale-110 transition-transform"
            >
                <span className="material-symbols-outlined text-4xl">bakery_dining</span>
            </Link>

            {/* Navigation Items */}
            <div className="flex flex-col gap-10 flex-1 justify-center">
                <Link
                    to="/dashboard"
                    className={`group cursor-pointer relative ${isActive('/dashboard') ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                        }`}
                >
                    <span className="material-symbols-outlined text-candy-pink dark:text-white text-4xl relative z-10">
                        grid_view
                    </span>
                </Link>

                <Link
                    to="/history"
                    className={`group cursor-pointer transition-all hover:scale-125 ${isActive('/history') ? 'opacity-100 text-candy-purple' : 'opacity-30 hover:opacity-100'
                        }`}
                >
                    <span className="material-symbols-outlined text-4xl dark:text-white">history_edu</span>
                </Link>

                <Link
                    to="/analytics"
                    className={`group cursor-pointer transition-all hover:scale-125 ${isActive('/analytics') ? 'opacity-100 text-candy-blue' : 'opacity-30 hover:opacity-100'
                        }`}
                >
                    <span className="material-symbols-outlined text-4xl dark:text-white">analytics</span>
                </Link>

                <Link
                    to="/profile"
                    className={`group cursor-pointer transition-all hover:scale-125 ${isActive('/profile') ? 'opacity-100 text-candy-orange' : 'opacity-30 hover:opacity-100'
                        }`}
                >
                    <span className="material-symbols-outlined text-4xl dark:text-white">settings</span>
                </Link>
            </div>

            {/* Logout Button */}
            <div className="mt-auto flex flex-col items-center gap-6">
                <button
                    onClick={logout}
                    className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center text-candy-pink cursor-pointer hover:bg-candy-pink hover:text-white transition-all"
                >
                    <span className="material-symbols-outlined text-3xl font-bold">logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
