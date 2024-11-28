import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  selectValue: { type: String, required: true },
}, { collection: 'bills' });

const BillForm = mongoose.models.BillForm || mongoose.model('BillForm', billSchema);

export default BillForm;