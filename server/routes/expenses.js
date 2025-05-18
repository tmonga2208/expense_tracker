import express from 'express';
import Expense from '../models/Expense.js';
import User from '../models/User.js';

const router = express.Router();

// Get expenses between two users
router.get('/:userId/:friendId', async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    console.log('Debug - Fetching expenses for users:', { userId, friendId });

    const expenses = await Expense.find({
      $or: [
        { userId, friendId },
        { userId: friendId, friendId: userId }
      ]
    })
    .sort({ date: -1 })
    .populate('userId', 'username')
    .populate('friendId', 'username');

    console.log('Debug - Found expenses:', expenses);
    res.json(expenses);
  } catch (error) {
    console.error('Debug - Error fetching expenses:', error);
    res.status(500).json({ message: 'Error fetching expenses: ' + error.message });
  }
});

// Add new expense
router.post('/', async (req, res) => {
  try {
    const { userId, friendId, date, description, paidAmount, lentAmount, paidBy, category } = req.body;
    
    const expense = new Expense({
      userId,
      friendId,
      date,
      description,
      paidAmount,
      lentAmount,
      paidBy,
      category
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Error creating expense: ' + error.message });
  }
});

// Mark expense as settled
router.patch('/:expenseId/settle', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    expense.isSettled = true;
    await expense.save();
    res.json(expense);
  } catch (error) {
    console.error('Error settling expense:', error);
    res.status(500).json({ message: 'Error settling expense: ' + error.message });
  }
});

export default router; 