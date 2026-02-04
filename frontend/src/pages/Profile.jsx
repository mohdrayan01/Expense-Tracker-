import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Shield, CreditCard, Puzzle, HelpCircle, ChevronDown, Moon, Sun, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || 'Sunny Sparkles',
        email: user?.email || ''
    });

    // Budget controls
    const [budgetLimit, setBudgetLimit] = useState(user?.preferences?.monthlyBudget || 3500);
    const [overspendAlerts, setOverspendAlerts] = useState(true);

    // Password section
    const [securityOpen, setSecurityOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    // New expandable sections
    const [linkedAccountsOpen, setLinkedAccountsOpen] = useState(false);
    const [integrationsOpen, setIntegrationsOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);

    // Integration toggles with localStorage
    const [integrations, setIntegrations] = useState(() => {
        const saved = localStorage.getItem('integrations');
        return saved ? JSON.parse(saved) : {
            csvExport: true,
            googleSheets: false,
            receiptScanner: true
        };
    });

    // Linked accounts with localStorage
    const [linkedAccounts, setLinkedAccounts] = useState(() => {
        const saved = localStorage.getItem('linkedAccounts');
        return saved ? JSON.parse(saved) : [];
    });

    // OAuth modal
    const [oauthModal, setOauthModal] = useState({ open: false, provider: null });
    const [oauthEmail, setOauthEmail] = useState('');

    // Toggle integration
    const toggleIntegration = (key) => {
        const newIntegrations = { ...integrations, [key]: !integrations[key] };
        setIntegrations(newIntegrations);
        localStorage.setItem('integrations', JSON.stringify(newIntegrations));
        toast.success(`${key === 'csvExport' ? 'CSV Import/Export' : key === 'googleSheets' ? 'Google Sheets Sync' : 'Receipt Scanner'} ${!integrations[key] ? 'enabled' : 'disabled'}!`);
    };

    // Open OAuth modal
    const openOAuthModal = (provider) => {
        setOauthModal({ open: true, provider });
        setOauthEmail('');
    };

    // Connect account
    const connectAccount = () => {
        if (!oauthEmail) {
            toast.error('Please enter your email');
            return;
        }
        const newAccount = {
            id: Date.now(),
            provider: oauthModal.provider.name,
            email: oauthEmail,
            icon: oauthModal.provider.icon,
            color: oauthModal.provider.color,
            connectedAt: new Date().toISOString()
        };
        const updatedAccounts = [...linkedAccounts, newAccount];
        setLinkedAccounts(updatedAccounts);
        localStorage.setItem('linkedAccounts', JSON.stringify(updatedAccounts));
        setOauthModal({ open: false, provider: null });
        toast.success(`${oauthModal.provider.name} connected successfully! 🎉`);
    };

    // Disconnect account
    const disconnectAccount = (id) => {
        const updatedAccounts = linkedAccounts.filter(acc => acc.id !== id);
        setLinkedAccounts(updatedAccounts);
        localStorage.setItem('linkedAccounts', JSON.stringify(updatedAccounts));
        toast.success('Account disconnected');
    };

    // Calculate role badge based on budget
    const getRoleBadge = () => {
        if (budgetLimit >= 5000) return '💎 Diamond Eater';
        if (budgetLimit >= 3000) return '🥇 Gold Spender';
        if (budgetLimit >= 1000) return '🥈 Silver Saver';
        return '🥉 Bronze Beginner';
    };

    const getJoinDate = () => {
        const date = new Date(user?.createdAt || Date.now());
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            setAvatar(reader.result);
            setUploading(true);
            try {
                await updateUser({ avatar: reader.result });
                toast.success('Profile picture updated!');
            } catch (error) {
                toast.error('Failed to upload image');
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            await updateUser({
                ...formData,
                preferences: {
                    ...user.preferences,
                    monthlyBudget: budgetLimit
                }
            });
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Password changed successfully');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setSecurityOpen(false);
            } else {
                toast.error(data.message || 'Failed to change password');
            }
        } catch (error) {
            toast.error('Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 pt-20 md:p-8 md:pt-24 lg:p-12 md:ml-32">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-sm font-bold text-candy-pink uppercase tracking-wider mb-2">
                            ACCOUNT & PREFERENCES
                        </h2>
                        <h1 className="text-5xl font-outfit font-black text-[#2d2d4a] dark:text-white">
                            Profile & Settings
                        </h1>
                    </div>
                    <button
                        onClick={logout}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-tr from-red-500 to-red-600 text-white font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Info & Budget */}
                    <div className="space-y-6">
                        {/* Avatar Card */}
                        <div className="glass-candy rounded-3xl p-8 text-center shadow-lg">
                            <div className="relative w-32 h-32 mx-auto mb-4">
                                <img
                                    src={avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=ff6b9d&color=fff&size=128`}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                />
                                <label className="absolute bottom-0 right-0 w-10 h-10 bg-candy-blue rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                                    <Camera size={20} className="text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <h3 className="text-2xl font-black text-[#2d2d4a] dark:text-white mb-1">
                                {formData.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-purple-300 mb-3">
                                {formData.email}
                            </p>

                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/50">
                                <div>
                                    <p className="text-xs text-candy-pink font-bold uppercase">Role</p>
                                    <p className="text-sm font-bold text-[#2d2d4a] dark:text-white">{getRoleBadge()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-candy-blue font-bold uppercase">Joined</p>
                                    <p className="text-sm font-bold text-[#2d2d4a] dark:text-white">{getJoinDate()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Budget Controls Card */}
                        <div className="glass-candy rounded-3xl p-6 shadow-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <DollarSign size={24} className="text-candy-pink" />
                                <h3 className="text-lg font-black text-[#2d2d4a] dark:text-white">
                                    Budget Controls
                                </h3>
                            </div>

                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-600 dark:text-purple-200 mb-2 block">
                                    Monthly Spend Limit
                                </label>
                                <div className="text-3xl font-black text-candy-pink mb-3">
                                    ${budgetLimit.toLocaleString()}
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="10000"
                                    step="100"
                                    value={budgetLimit}
                                    onChange={(e) => setBudgetLimit(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider-pink"
                                />
                                <div className="flex justify-between text-xs text-gray-500 dark:text-purple-300 mt-1">
                                    <span>$0</span>
                                    <span>$10,000</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">💸</span>
                                    <span className="text-sm font-medium text-[#2d2d4a] dark:text-white">Overspend Alerts</span>
                                </div>
                                <button
                                    onClick={() => setOverspendAlerts(!overspendAlerts)}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${overspendAlerts ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                >
                                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${overspendAlerts ? 'translate-x-6' : ''
                                        }`}></span>
                                </button>
                            </div>

                            <button
                                onClick={handleUpdateProfile}
                                disabled={loading}
                                className="w-full mt-4 px-6 py-3 rounded-2xl bg-gradient-to-tr from-candy-purple to-candy-blue text-white font-bold hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Settings Cards (2 columns) */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Experience Theme - Full Width */}
                        <div className="md:col-span-2 glass-candy rounded-3xl p-8 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-[#2d2d4a] dark:text-white mb-2">
                                        Experience Theme
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-purple-300 mb-4">
                                        Toggle between light and dark modes to suit your mood. Your eyes will thank you during late-night budget planning!
                                    </p>

                                    <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl">
                                        <div className="flex items-center gap-3 flex-1">
                                            <Sun className="text-yellow-500" size={20} />
                                            <span className="font-medium text-[#2d2d4a] dark:text-white">Light</span>
                                        </div>

                                        <button
                                            onClick={toggleTheme}
                                            className={`relative w-16 h-8 rounded-full transition-colors ${theme === 'dark' ? 'bg-purple-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform flex items-center justify-center ${theme === 'dark' ? 'translate-x-8' : ''
                                                }`}>
                                                {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                                            </span>
                                        </button>

                                        <div className="flex items-center gap-3 flex-1">
                                            <span className="font-medium text-[#2d2d4a] dark:text-white">Dark</span>
                                            <Moon className="text-purple-600" size={20} />
                                        </div>
                                    </div>

                                    <p className="text-sm font-bold text-candy-purple dark:text-purple-300 mt-3">
                                        {theme === 'dark' ? '🌙 Dark Mode Activated' : '☀️ Light Mode Active'}
                                    </p>
                                </div>

                                <div className="hidden md:block">
                                    <div className="w-48 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg flex items-center justify-center">
                                        <div className="w-36 h-20 bg-slate-800 dark:bg-white rounded-lg p-3">
                                            <div className="w-full h-2 bg-pink-500 rounded mb-2"></div>
                                            <div className="w-3/4 h-2 bg-purple-500 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Privacy & Security - Collapsible */}
                        <div
                            className="glass-candy rounded-3xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all"
                            onClick={() => setSecurityOpen(!securityOpen)}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                                    <Shield size={24} className="text-pink-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-[#2d2d4a] dark:text-white">
                                        Privacy & Security
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-purple-300 mt-1">
                                        Manage 2FA, passwords, accounts, and session devices
                                    </p>
                                </div>
                                <ChevronDown
                                    className={`transform transition-transform flex-shrink-0 text-[#2d2d4a] dark:text-white ${securityOpen ? 'rotate-180' : ''}`}
                                    size={20}
                                />
                            </div>

                            <AnimatePresence>
                                {securityOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-6 pt-6 border-t border-white/50 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
                                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                                <Input
                                                    label="Current Password"
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    required
                                                />
                                                <Input
                                                    label="New Password"
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    required
                                                />
                                                <Input
                                                    label="Confirm New Password"
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full px-6 py-3 rounded-2xl bg-gradient-to-tr from-purple-500 to-blue-500 text-white font-bold hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
                                                >
                                                    {loading ? 'Changing...' : 'Change Password'}
                                                </button>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Linked Accounts */}
                        <div
                            className="glass-candy rounded-3xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all"
                            onClick={() => setLinkedAccountsOpen(!linkedAccountsOpen)}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                    <CreditCard size={24} className="text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-[#2d2d4a] dark:text-white">
                                        Linked Accounts
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-purple-300 mt-1">
                                        Connect your bank accounts and digital wallets securely
                                    </p>
                                </div>
                                <ChevronDown
                                    className={`transform transition-transform flex-shrink-0 text-[#2d2d4a] dark:text-white ${linkedAccountsOpen ? 'rotate-180' : ''}`}
                                    size={20}
                                />
                            </div>

                            <AnimatePresence>
                                {linkedAccountsOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-6 pt-6 border-t border-white/50 dark:border-slate-700 space-y-4" onClick={(e) => e.stopPropagation()}>
                                            {linkedAccounts.length === 0 ? (
                                                <p className="text-center text-gray-500 dark:text-purple-300 py-4">No accounts connected yet</p>
                                            ) : (
                                                linkedAccounts.map((account) => (
                                                    <div key={account.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 ${account.color} rounded-full flex items-center justify-center text-xl`}>
                                                                {account.icon}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-[#2d2d4a] dark:text-white">{account.provider}</p>
                                                                <p className="text-xs text-gray-500 dark:text-purple-300">{account.email}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => disconnectAccount(account.id)}
                                                            className="text-red-500 hover:text-red-700 font-bold text-sm"
                                                        >
                                                            Disconnect
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { name: 'Google Pay', icon: '💳', color: 'bg-blue-100' },
                                                    { name: 'PhonePe', icon: '💜', color: 'bg-purple-100' },
                                                    { name: 'Paytm', icon: '💙', color: 'bg-cyan-100' },
                                                    { name: 'Bank Account', icon: '🏦', color: 'bg-green-100' }
                                                ].map((provider, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => openOAuthModal(provider)}
                                                        className="px-4 py-3 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-500 text-white font-bold hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2"
                                                    >
                                                        <span>{provider.icon}</span>
                                                        <span className="text-sm">Connect {provider.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Integrations */}
                        <div
                            className="glass-candy rounded-3xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all"
                            onClick={() => setIntegrationsOpen(!integrationsOpen)}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                    <Puzzle size={24} className="text-purple-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-[#2d2d4a] dark:text-white">
                                        Integrations
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-purple-300 mt-1">
                                        Sync with food apps, coffee rewards, and more
                                    </p>
                                </div>
                                <ChevronDown
                                    className={`transform transition-transform flex-shrink-0 text-[#2d2d4a] dark:text-white ${integrationsOpen ? 'rotate-180' : ''}`}
                                    size={20}
                                />
                            </div>

                            <AnimatePresence>
                                {integrationsOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-6 pt-6 border-t border-white/50 dark:border-slate-700 space-y-4" onClick={(e) => e.stopPropagation()}>
                                            {[
                                                { key: 'csvExport', name: 'CSV Import/Export', desc: 'Import and export your expense data' },
                                                { key: 'googleSheets', name: 'Google Sheets Sync', desc: 'Auto-sync with Google Sheets' },
                                                { key: 'receiptScanner', name: 'Receipt Scanner', desc: 'Scan receipts with your camera' }
                                            ].map((integration, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                                                    <div>
                                                        <p className="font-bold text-[#2d2d4a] dark:text-white">{integration.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-purple-300">{integration.desc}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleIntegration(integration.key)}
                                                        className={`relative w-12 h-6 rounded-full transition-colors ${integrations[integration.key] ? 'bg-green-500' : 'bg-gray-300'}`}
                                                    >
                                                        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${integrations[integration.key] ? 'translate-x-6' : ''}`}></span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Help & Support */}
                        <div
                            className="glass-candy rounded-3xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all"
                            onClick={() => setHelpOpen(!helpOpen)}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                    <HelpCircle size={24} className="text-green-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-[#2d2d4a] dark:text-white">
                                        Help & Support
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-purple-300 mt-1">
                                        Get in touch with us or browse the FAQ section
                                    </p>
                                </div>
                                <ChevronDown
                                    className={`transform transition-transform flex-shrink-0 text-[#2d2d4a] dark:text-white ${helpOpen ? 'rotate-180' : ''}`}
                                    size={20}
                                />
                            </div>

                            <AnimatePresence>
                                {helpOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-6 pt-6 border-t border-white/50 dark:border-slate-700 space-y-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                                <p className="font-bold text-[#2d2d4a] dark:text-white mb-2">📧 Contact Support</p>
                                                <p className="text-sm text-gray-600 dark:text-purple-300 mb-1">Email: <span className="font-bold text-candy-pink">support@candydash.com</span></p>
                                                <p className="text-xs text-gray-500 dark:text-purple-400">We reply within 24 hours! 💌</p>
                                            </div>
                                            <div className="space-y-3">
                                                <p className="font-bold text-[#2d2d4a] dark:text-white">Frequently Asked Questions</p>
                                                {[
                                                    { q: 'How do I add an expense?', a: 'Click the + button or go to Add Expense page!' },
                                                    { q: 'Can I export my data?', a: 'Yes! Use the Integrations section to enable CSV export.' },
                                                    { q: 'How secure is my data?', a: 'All data is encrypted and stored securely.' }
                                                ].map((faq, idx) => (
                                                    <details key={idx} className="group">
                                                        <summary className="cursor-pointer p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg font-medium text-[#2d2d4a] dark:text-white hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all">
                                                            {faq.q}
                                                        </summary>
                                                        <p className="mt-2 p-3 text-sm text-gray-600 dark:text-purple-300">{faq.a}</p>
                                                    </details>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => toast.success('Message sent! We\'ll get back to you soon 💌')}
                                                className="w-full px-6 py-3 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-500 text-white font-bold hover:scale-105 transition-transform shadow-lg"
                                            >
                                                Send Us a Message
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            {/* OAuth Modal */}
            <AnimatePresence>
                {oauthModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                        onClick={() => setOauthModal({ open: false, provider: null })}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-candy max-w-md w-full rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="text-center mb-6">
                                <div className={`w-16 h-16 ${oauthModal.provider?.color} rounded-full flex items-center justify-center text-3xl mx-auto mb-4`}>
                                    {oauthModal.provider?.icon}
                                </div>
                                <h3 className="text-2xl font-outfit font-black text-[#2d2d4a] dark:text-white mb-2">
                                    Connect {oauthModal.provider?.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-purple-300">
                                    Enter your email to link your account
                                </p>
                            </div>
                            <input
                                type="email"
                                value={oauthEmail}
                                onChange={(e) => setOauthEmail(e.target.value)}
                                placeholder="your.email@example.com"
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-700 border-2 border-transparent focus:border-candy-pink focus:outline-none font-medium text-[#2d2d4a] dark:text-white mb-6"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setOauthModal({ open: false, provider: null })}
                                    className="flex-1 px-6 py-3 rounded-2xl bg-gray-200 dark:bg-slate-700 text-[#2d2d4a] dark:text-white font-bold hover:scale-105 transition-transform"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={connectAccount}
                                    className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-500 text-white font-bold hover:scale-105 transition-transform shadow-lg"
                                >
                                    Authorize
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
