import mongoose from 'mongoose';

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  monthlyBudget: {
    type: Number,
    default: 0
  },
  savingsGoals: [{
    name: String,
    targetAmount: Number,
    currentAmount: Number,
    targetDate: Date
  }],
  banking: {
    totalBalance: {
      type: Number,
      default: 0
    },
    accounts: [{
      name: String,
      balance: Number,
      type: String // savings, checking, investment, etc.
    }]
  }
}, {
  timestamps: true
});

export default mongoose.model('UserSettings', userSettingsSchema); 