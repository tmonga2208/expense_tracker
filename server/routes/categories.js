import express from 'express';
import Category from '../models/Category.js';
import Expense from '../models/Expense.js';

const router = express.Router();

// Get all categories for a user
router.get('/:userId', async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.params.userId });
    
    // Calculate total amount for each category
    const categoriesWithAmounts = await Promise.all(categories.map(async (category) => {
      const expenses = await Expense.find({ 
        category: category.name,
        userId: req.params.userId
      });
      
      const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        ...category.toObject(),
        totalAmount
      };
    }));

    res.json(categoriesWithAmounts);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Get expenses for a specific category
router.get('/:userId/:categoryName/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.params.userId,
      category: req.params.categoryName
    }).sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    console.error('Error fetching category expenses:', error);
    res.status(500).json({ message: 'Error fetching category expenses' });
  }
});

// Create a new category
router.post('/:userId', async (req, res) => {
  try {
    const { name, icon } = req.body;
    
    const existingCategory = await Category.findOne({
      userId: req.params.userId,
      name
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      userId: req.params.userId,
      name,
      icon
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Error creating category' });
  }
});

export default router; 