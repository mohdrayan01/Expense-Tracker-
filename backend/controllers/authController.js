import User from '../models/User.js';
import Category from '../models/Category.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('Signup attempt:', { name, email, passwordLength: password?.length });

        // Validate password length
        if (!password || password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        const user = await User.create({ name, email, password });

        // Create default categories for the user
        const defaultCategories = [
            { user: user._id, name: 'Food', icon: '🍔', color: '#ef4444', isDefault: true },
            { user: user._id, name: 'Transport', icon: '🚗', color: '#3b82f6', isDefault: true },
            { user: user._id, name: 'Shopping', icon: '🛒', color: '#8b5cf6', isDefault: true },
            { user: user._id, name: 'Entertainment', icon: '🎮', color: '#ec4899', isDefault: true },
            { user: user._id, name: 'Bills', icon: '💡', color: '#f59e0b', isDefault: true },
            { user: user._id, name: 'Health', icon: '⚕️', color: '#10b981', isDefault: true },
            { user: user._id, name: 'Others', icon: '📝', color: '#6366f1', isDefault: true }
        ];
        await Category.insertMany(defaultCategories);

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                preferences: user.preferences
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Signup failed. Please try again.'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt:', { email });

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                preferences: user.preferences
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Login failed. Please try again.'
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                preferences: user.preferences
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.avatar) user.avatar = req.body.avatar;
        if (req.body.preferences) {
            user.preferences = { ...user.preferences, ...req.body.preferences };
        }

        const updatedUser = await user.save();

        res.json({
            success: true,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                preferences: updatedUser.preferences
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide both current and new passwords' });
        }

        // Get user with password field
        const user = await User.findById(req.user._id).select('+password');

        // Check current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
