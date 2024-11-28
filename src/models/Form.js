import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  selectValue: { type: String, required: true },
});

const Form = mongoose.models.Form || mongoose.model('Form', formSchema ,'transactions');

export default Form;