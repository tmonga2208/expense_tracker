import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  paidAmount: {
    type: Number,
    required: true
  },
  lentAmount: {
    type: Number,
    required: true
  },
  paidBy: {
    type: String,
    required: true,
    enum: ['you', 'friend']
  },
  category: {
    type: String,
    required: true
  },
  isSettled: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('Expense', expenseSchema); 