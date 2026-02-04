import { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const SmartTip = () => {
    const [tip, setTip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reaction, setReaction] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        fetchSmartTip();
    }, []);

    const fetchSmartTip = async () => {
        setLoading(true);
        try {
            const response = await api.get('/tips/smart');
            setTip(response.data.tip);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
        } catch (error) {
            console.error('Failed to fetch smart tip:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !tip) return null;

    const reactions = ['😍', '🤔', '😂', '👍', '🎉'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative glass-candy rounded-3xl p-8 shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300"
        >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/20 via-pink-200/20 to-purple-200/20 dark:from-yellow-500/10 dark:via-pink-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Confetti Effect */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: -20, x: Math.random() * 400, opacity: 1 }}
                            animate={{ y: 400, rotate: 360, opacity: 0 }}
                            transition={{ duration: 2, delay: Math.random() * 0.5 }}
                            className="absolute text-2xl"
                        >
                            {reactions[Math.floor(Math.random() * reactions.length)]}
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="relative z-10">
                {/* Header with Mascot */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        {/* Animated Mascot */}
                        <motion.div
                            animate={{
                                rotate: [0, -10, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg"
                        >
                            <span className="text-3xl">💡</span>
                        </motion.div>

                        <div>
                            <div className="flex items-center gap-2">
                                <Lightbulb size={20} className="text-yellow-500 animate-pulse" />
                                <h3 className="text-lg font-black text-[#2d2d4a] dark:text-purple-100 uppercase tracking-wide">
                                    Smart Tip
                                </h3>
                            </div>
                            <p className="text-xs text-purple-500 dark:text-purple-300 font-medium">
                                AI-Powered Insight ✨
                            </p>
                        </div>
                    </div>

                    {/* Category Badge */}
                    <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-md">
                        {tip.category || 'General'}
                    </span>
                </div>

                {/* Speech Bubble Tip Content */}
                <div className="relative mb-6">
                    <div className="bg-white/70 dark:bg-slate-800/70 rounded-3xl p-6 shadow-inner border-2 border-white/80">
                        {/* Speech Bubble Arrow */}
                        <div className="absolute -top-3 left-20 w-6 h-6 bg-white/70 dark:bg-slate-800/70 border-l-2 border-t-2 border-white/80 transform rotate-45"></div>

                        <p className="text-lg text-[#2d2d4a] dark:text-purple-50 font-bold leading-relaxed">
                            {tip.message}
                        </p>

                        {tip.percentage && (
                            <div className="my-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600 dark:text-purple-300">
                                        Spending Progress
                                    </span>
                                    <span className="text-sm font-black text-candy-pink">{tip.percentage}%</span>
                                </div>
                                <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(tip.percentage, 100)}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-3 rounded-full bg-gradient-to-r from-candy-pink via-candy-purple to-candy-blue"
                                    ></motion.div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex items-center gap-3 flex-wrap mb-6">
                    <button
                        onClick={() => fetchSmartTip()}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-tr from-candy-blue to-cyan-400 text-white font-bold text-sm hover:scale-105 hover:shadow-xl transition-all flex items-center gap-2"
                    >
                        <RefreshCw size={16} />
                        New Tip
                    </button>

                    <button className="px-6 py-3 rounded-2xl bg-white/60 dark:bg-slate-700 text-[#2d2d4a] dark:text-white font-bold text-sm hover:bg-white dark:hover:bg-slate-600 transition-all border-2 border-white dark:border-slate-600 flex items-center gap-2">
                        <Star size={16} />
                        Save Tip
                    </button>
                </div>

                {/* Emoji Reactions */}
                <div className="pt-6 border-t-2 border-white/50 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-purple-300">
                            Quick React:
                        </span>
                        <div className="flex gap-2">
                            {reactions.map((emoji, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.3 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setReaction(emoji)}
                                    className={`w-10 h-10 rounded-full transition-all ${reaction === emoji
                                        ? 'bg-gradient-to-br from-pink-400 to-purple-400 shadow-lg scale-110'
                                        : 'bg-white/60 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600'
                                        }`}
                                >
                                    <span className="text-xl">{emoji}</span>
                                </motion.button>
                            ))}
                        </div>

                        {reaction && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-sm text-green-600 dark:text-green-400 font-medium"
                            >
                                Thanks! ✨
                            </motion.span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SmartTip;
