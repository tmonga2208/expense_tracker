import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  buserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  btitle: { type: String, required: true },
  bdate: { type: Date, required: true },
  bdescription: { type: String, required: true },
  bamount: { type: Number, required: true },
  bcategory: { type: String, required: true },
  bselectValue: { type: String, required: true },
}, { collection: 'bills' });

const BillForm = mongoose.models.Form || mongoose.model('BillForm', billSchema);

export default BillForm;