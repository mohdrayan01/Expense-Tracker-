import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await signup({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
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
                        <h1 className="text-4xl font-outfit font-black text-[#2d2d4a] mb-2">Welcome!</h1>
                        <p className="text-gray-400 font-medium">Join thousands of students saving their coins.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-candy-pink focus:outline-none font-medium"
                            placeholder="Full Name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <input
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-candy-pink focus:outline-none font-medium"
                            placeholder="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <input
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-candy-pink focus:outline-none font-medium"
                            placeholder="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        <input
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-candy-pink focus:outline-none font-medium"
                            placeholder="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-candy-pink to-candy-purple text-white rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Start Your Stash'}
                        </button>

                        <p className="text-center text-gray-500 dark:text-purple-300 font-medium mt-4">
                            Already a stasher?{' '}
                            <Link to="/login" className="text-candy-purple font-bold cursor-pointer hover:underline">
                                Log in here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
