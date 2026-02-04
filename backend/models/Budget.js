import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    amount: {
        type: Number,
        required: [true, 'Please add a budget amount'],
        min: [0, 'Budget cannot be negative']
    },
    period: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly'
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    alertThreshold: {
        type: Number,
        default: 80,
        min: [0, 'Threshold cannot be negative'],
        max: [100, 'Threshold cannot exceed 100']
    }
}, {
    timestamps: true
});

// Index for faster queries
budgetSchema.index({ user: 1 });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
