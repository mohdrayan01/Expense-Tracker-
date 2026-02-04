import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
        min: [0, 'Amount cannot be negative']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please add a category']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
        default: Date.now
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'Online'],
        default: 'Cash'
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Indexes for faster queries
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
