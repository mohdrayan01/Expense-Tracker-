import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error details:', error.response?.data);

            // Show helpful error messages
            if (error.response?.status === 401) {
                toast.error('Invalid email or password. Please check your credentials.');
            } else if (error.response?.status === 404) {
                toast.error('Account not found. Please sign up first!', { duration: 4000 });
            } else if (error.message?.includes('Network Error')) {
                toast.error('Cannot connect to server. Please ensure backend is running.');
            } else {
                toast.error(error.response?.data?.message || 'Login failed. Try signing up first!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen mesh-container flex items-center justify-center p-6 relative">
            {/* Back Button */}
            <Link to="/" className="absolute top-8 left-8 z-50">
                <button className="w-12 h-12 rounded-full bg-white dark:bg-slate-700 shadow-lg flex items-center justify-center hover:scale-110 transition-all">
                    <ArrowLeft size={20} className="text-[#2d2d4a] dark:text-white" />
                </button>
            </Link>

            <div className="w-full max-w-6xl bg-white/40 backdrop-blur-md rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white flex">
                {/* Left Side - Illustration */}
                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-candy-pink/20 to-candy-blue/20 items-center justify-center">
                    <div className="text-center space-y-8">
                        <span className="material-symbols-outlined text-[15rem] text-candy-pink drop-shadow-2xl floating-3d">
                            savings
                        </span>
                        <h2 className="text-4xl font-outfit font-black text-[#2d2d4a]">Save Sweetly.</h2>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 bg-white p-12 lg:p-20">
                    <div className="mb-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-candy-pink to-candy-purple rounded-2xl flex items-center justify-center shadow-lg text-white mb-6">
                            <span className="material-symbols-outlined">icecream</span>
                        </div>
                        <h1 className="text-4xl font-outfit font-black text-[#2d2d4a] mb-2">Welcome Back!</h1>
                        <p className="text-gray-400 font-medium">Sign in to manage your sweet stash.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-candy-pink focus:outline-none font-medium"
                            placeholder="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <div className="relative">
                            <input
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-candy-pink focus:outline-none font-medium"
                                placeholder="Password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-candy-pink transition-colors"
                            >
                                <span className="material-symbols-outlined">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-candy-pink to-candy-purple text-white rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Signing In...' : 'Sign In to Your Stash'}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-gray-400 text-sm font-medium">OR CONTINUE WITH</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        {/* OAuth Buttons */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                type="button"
                                onClick={() => toast('Google login coming soon! 🎉', { icon: '🔐' })}
                                className="flex items-center justify-center gap-3 py-4 px-6 bg-white border-2 border-gray-200 rounded-2xl font-bold text-gray-700 hover:border-candy-pink hover:bg-pink-50 transition-all"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                onClick={() => toast('Apple login coming soon! 🍎', { icon: '🔐' })}
                                className="flex items-center justify-center gap-3 py-4 px-6 bg-black border-2 border-gray-800 rounded-2xl font-bold text-white hover:bg-gray-900 transition-all"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                Apple
                            </button>
                        </div>

                        <p className="text-center text-gray-500 dark:text-purple-300 font-medium mt-4">
                            New to CandyDash?{' '}
                            <Link to="/signup" className="text-candy-purple font-bold cursor-pointer hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
