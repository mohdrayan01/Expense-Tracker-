import { Link, useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="mesh-container min-h-screen">
            {/* Navigation */}
            <nav className="px-12 py-8 flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-candy-pink to-candy-purple rounded-xl flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-white">account_balance_wallet</span>
                    </div>
                    <span className="text-2xl font-outfit font-black text-[#2d2d4a]">SpendWise</span>
                </div>
                <div className="flex gap-8 items-center">
                    <Link to="/login" className="font-bold text-[#4a4a6a] hover:text-candy-pink transition-colors">
                        Enter App
                    </Link>
                    <Link to="/signup" className="px-6 py-2 bg-candy-pink text-white rounded-full font-bold hover:scale-105 transition-transform">
                        Join Now
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-12 pt-20 flex flex-col lg:flex-row items-center gap-20">
                <div className="lg:w-1/2 space-y-8">
                    <h1 className="text-7xl font-outfit font-black text-[#2d2d4a] leading-none">
                        Manage your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-candy-pink to-candy-purple">
                            Financial World
                        </span>
                    </h1>
                    <p className="text-xl text-[#4a4a6a] max-w-md font-medium">
                        The most playful way to track your sugar stash and daily treats. Safe, sweet, and simple.
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-10 py-5 bg-candy-pink text-white rounded-3xl font-black text-xl shadow-2xl hover:scale-105 transition-all"
                    >
                        Get Started Free
                    </button>
                </div>

                <div className="lg:w-1/2">
                    <div className="iridescent-border shadow-2xl">
                        <div className="glass-candy h-[340px] w-[540px] p-10 flex flex-col justify-between rounded-[2.3rem]">
                            <div className="flex justify-between items-start">
                                <div className="w-16 h-11 bg-yellow-400/80 rounded-lg shadow-sm"></div>
                                <span className="material-symbols-outlined text-candy-pink text-4xl">contactless</span>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-black tracking-widest uppercase mb-2">Active Dashboard</p>
                                <p className="text-[#2d2d4a] dark:text-white text-3xl font-outfit font-bold">SUNNY SPENDER</p>
                            </div>
                            <div className="flex justify-between items-end border-t border-gray-100 pt-6">
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-xs font-black tracking-widest uppercase">Total Balance</p>
                                    <p className="text-[#2d2d4a] dark:text-white text-5xl font-outfit font-black">$12,450.00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-12 py-20">
                <h2 className="text-5xl font-outfit font-black text-center text-[#2d2d4a] mb-16">
                    Sweet Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: 'analytics', title: 'Smart Analytics', desc: 'Visualize your spending with beautiful charts' },
                        { icon: 'notifications_active', title: 'Budget Alerts', desc: 'Get notified when approaching limits' },
                        { icon: 'security', title: 'Secure & Private', desc: 'Your data is encrypted and safe' },
                    ].map((feature, i) => (
                        <div key={i} className="glass-candy rounded-[2rem] p-8 hover:-translate-y-2 transition-all">
                            <div className="w-14 h-14 bg-gradient-to-br from-candy-pink to-candy-purple rounded-2xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-white text-3xl">{feature.icon}</span>
                            </div>
                            <h3 className="text-xl font-outfit font-bold text-[#2d2d4a] mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="max-w-4xl mx-auto px-12 py-16">
                <div className="glass-candy rounded-[3rem] p-12 text-center">
                    <h2 className="text-4xl font-outfit font-black text-[#2d2d4a] mb-4">
                        Ready to Save Sweetly?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Join thousands of students managing their finances
                    </p>
                    <Link to="/signup">
                        <button className="px-10 py-5 bg-gradient-to-r from-candy-pink to-candy-purple text-white rounded-3xl font-black text-xl shadow-xl hover:scale-105 transition-all">
                            Create Free Account
                        </button>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/50 mt-16">
                <div className="max-w-7xl mx-auto px-12 py-8 text-center">
                    <p className="text-gray-600">© 2026 SpendWise. All rights reserved. 🍭</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
