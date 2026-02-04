import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user._id }).sort({ name: 1 });
        res.json({ success: true, categories });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res) => {
    try {
        const category = await Category.create({
            ...req.body,
            user: req.user._id
        });
        res.status(201).json({ success: true, category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Check ownership
        if (category.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({ success: true, category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Check ownership
        if (category.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Prevent deletion of default categories
        if (category.isDefault) {
            return res.status(400).json({ success: false, message: 'Cannot delete default categories' });
        }

        await category.deleteOne();
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
