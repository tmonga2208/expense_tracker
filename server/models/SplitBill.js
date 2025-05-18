import mongoose from 'mongoose';

const splitBillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: String,
  date: {
    type: Date,
    default: Date.now
  },
  category: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    paid: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'settled'],
    default: 'pending'
  }
});

export default mongoose.model('SplitBill', splitBillSchema); 