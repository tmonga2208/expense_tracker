import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import Form from '../src/models/Form.js';
import BillForm from '../src/models/BillForm.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });

  try {
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
  res.json({ token });
});

// Middleware to authenticate and extract user ID from token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/submit-form', authenticateToken, async (req, res) => {
  const { title, date, description, amount, category, selectValue } = req.body;

  const form = new Form({
    userId: req.user.id,
    title,
    date,
    description,
    amount,
    category,
    selectValue,
  });

  try {
    await form.save();
    res.status(201).json({ message: 'Form data saved' });
  } catch (error) {
    res.status(400).json({ message: 'Error saving form data' });
  }
});

app.post('/submit-bill-form', authenticateToken, async (req, res) => {
  const { title, date, description, amount, category, selectValue } = req.body;

  const form = new BillForm({
    userId: req.user.id,
    title,
    date,
    description,
    amount,
    category,
    selectValue,
  });

  try {
    await form.save();
    console.log('this works!!')
    res.status(201).json({ message: 'Bill data saved' });
  } catch (error) {
    res.status(400).json({ message: 'Error saving Bill data' }); 
  }
});

app.get('/form-data', authenticateToken, async (req, res) => {
  try {
    const forms = await Form.find({ userId: req.user.id });
    res.status(200).json(forms);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching form data' });
  }
});

app.get('/bill-form-data', authenticateToken, async (req, res) => {
  try {
    const forms = await BillForm.find({ userId: req.user.id });
    res.status(200).json(forms);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching form data' });
  }
});

app.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});