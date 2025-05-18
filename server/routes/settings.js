import express from 'express';
import UserSettings from '../models/UserSettings.js';

const router = express.Router();

// Get user settings
router.get('/:userId', async (req, res) => {
  try {
    const settings = await UserSettings.findOne({ userId: req.params.userId });
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user settings
router.put('/:userId', async (req, res) => {
  try {
    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add savings goal
router.post('/:userId/savings', async (req, res) => {
  try {
    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.params.userId },
      { $push: { savingsGoals: req.body } },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update savings goal
router.put('/:userId/savings/:goalId', async (req, res) => {
  try {
    const settings = await UserSettings.findOneAndUpdate(
      { 
        userId: req.params.userId,
        'savingsGoals._id': req.params.goalId
      },
      { $set: { 'savingsGoals.$': req.body } },
      { new: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add bank account
router.post('/:userId/banking', async (req, res) => {
  try {
    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.params.userId },
      { 
        $push: { 'banking.accounts': req.body },
        $inc: { 'banking.totalBalance': req.body.balance }
      },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 