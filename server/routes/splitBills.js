import express from 'express';
import SplitBill from '../models/SplitBill.js';
import User from '../models/User.js';

const router = express.Router();

// Create a new split bill
router.post('/', async (req, res) => {
  try {
    const { title, amount, description, category, participants } = req.body;
    const splitBill = new SplitBill({
      title,
      amount,
      description,
      category,
      createdBy: req.user.id,
      participants: participants.map(p => ({
        user: p.userId,
        amount: p.amount
      }))
    });
    await splitBill.save();
    res.status(201).json(splitBill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all split bills for a user
router.get('/', async (req, res) => {
  try {
    const splitBills = await SplitBill.find({
      $or: [
        { createdBy: req.user.id },
        { 'participants.user': req.user.id }
      ]
    })
    .populate('createdBy', 'username')
    .populate('participants.user', 'username');
    res.json(splitBills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific split bill
router.get('/:id', async (req, res) => {
  try {
    const splitBill = await SplitBill.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('participants.user', 'username');
    
    if (!splitBill) {
      return res.status(404).json({ message: 'Split bill not found' });
    }
    
    res.json(splitBill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update split bill status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const splitBill = await SplitBill.findById(req.params.id);
    
    if (!splitBill) {
      return res.status(404).json({ message: 'Split bill not found' });
    }
    
    splitBill.status = status;
    await splitBill.save();
    res.json(splitBill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update participant payment status
router.patch('/:id/participants/:participantId', async (req, res) => {
  try {
    const { paid } = req.body;
    const splitBill = await SplitBill.findById(req.params.id);
    
    if (!splitBill) {
      return res.status(404).json({ message: 'Split bill not found' });
    }
    
    const participant = splitBill.participants.id(req.params.participantId);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    
    participant.paid = paid;
    await splitBill.save();
    res.json(splitBill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a split bill
router.delete('/:id', async (req, res) => {
  try {
    const splitBill = await SplitBill.findById(req.params.id);
    
    if (!splitBill) {
      return res.status(404).json({ message: 'Split bill not found' });
    }
    
    if (splitBill.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this bill' });
    }
    
    await splitBill.deleteOne();
    res.json({ message: 'Split bill deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 