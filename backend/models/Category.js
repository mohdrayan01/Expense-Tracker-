import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        trim: true
    },
    icon: {
        type: String,
        default: '📁'
    },
    color: {
        type: String,
        default: '#6366f1'
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
categorySchema.index({ user: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;
