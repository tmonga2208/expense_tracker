import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import Form from '../src/models/Form.js';
import BillForm from '../src/models/BillForm.js';
import UserInfo from '../src/models/user.js';
import User from './models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';
import friendsRouter from './routes/friends.js';
import splitBillsRouter from './routes/splitBills.js';
import expensesRouter from './routes/expenses.js';
import settingsRouter from './routes/settings.js';
import categoriesRouter from './routes/categories.js';

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

app.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ 
    username, 
    password: hashedPassword,
    email: email || undefined // Make email optional
  });
  try {
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: 'Error creating user: ' + error.message });
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
  res.json({ 
    token,
    userId: user._id,
    username: user.username 
  });
});

// Middleware to authenticate and extract user ID from token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = { id: user.id }; // Ensure the user ID is attached to req.user
    next();
  });
};


app.post('/update-profile', authenticateToken, async (req, res) => {
  const { username, email, fullName, bio, location, website, password } = req.body;

  try {
    const user = await UserInfo.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.fullName = fullName || user.fullName;
    user.bio = bio || user.bio;
    user.location = location || user.location;
    user.website = website || user.website;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile' });
  }
});

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

app.get('/bill-formdata', authenticateToken, async (req, res) => {
  try {
    const forms = await BillForm.find({ userId: req.user.id });
    res.status(200).json(forms);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching bill data' });
  }
});

app.get('/update-profile', authenticateToken, async (req, res) => {
  try {
    const user = await UserInfo.findById(req.user.id);
    if (!user) {
      const NewUser = await User.create(
        { username: user.username || 'johndoe', 
          email: user.email || 'johndoe@gmail.com', 
          fullName: user.fullName || 'johndoe@gmail.com', 
          bio: user.bio || 'Entusiastic',
          location: user.location || 'Nigeria', 
          website: user.website || 'https://johndoe.com',
          password: user.password }); 
      await NewUser.save();
      user = NewUser;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching user data' });
  }
});

app.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await UserInfo.find({}, 'username');
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching usernames' });
  }
});

app.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

// Add friends routes
app.use('/friends', authenticateToken, friendsRouter);

// Add split bills routes
app.use('/split-bills', authenticateToken, splitBillsRouter);

// Add expenses routes
app.use('/expenses', authenticateToken, expensesRouter);

// Add settings routes
app.use('/settings', authenticateToken, settingsRouter);

// Add categories routes
app.use('/categories', authenticateToken, categoriesRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});