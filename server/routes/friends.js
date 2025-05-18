import express from 'express';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// Search users
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      username: { $regex: query, $options: 'i' }
    }).select('username _id');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's friends
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('friends', 'username _id');
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add friend
router.post('/:userId/add/:friendId', async (req, res) => {
  try {
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(req.params.userId) || !mongoose.Types.ObjectId.isValid(req.params.friendId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    // Prevent self-friending
    if (user._id.toString() === friend._id.toString()) {
      return res.status(400).json({ message: 'Cannot add yourself as a friend' });
    }

    // Check if they're already friends
    if (user.friends.some(friendId => friendId.toString() === friend._id.toString())) {
      return res.status(400).json({ message: 'Already friends with this user' });
    }

    // Add friend to user's friends list
    user.friends.push(friend._id);
    await user.save();

    // Add user to friend's friends list (bidirectional relationship)
    friend.friends.push(user._id);
    await friend.save();

    res.json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ 
      message: 'Error adding friend',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Remove friend
router.delete('/:userId/remove/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.friends = user.friends.filter(
      friendId => friendId.toString() !== req.params.friendId
    );
    await user.save();
    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get friend by username
router.get('/by-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    console.log('Debug - Looking up friend by username:', username);
    
    const friend = await User.findOne({ username });
    console.log('Debug - Found friend:', friend);
    
    if (!friend) {
      console.log('Debug - Friend not found for username:', username);
      return res.status(404).json({ message: 'Friend not found' });
    }

    res.json(friend);
  } catch (error) {
    console.error('Debug - Error finding friend:', error);
    res.status(500).json({ message: 'Error finding friend: ' + error.message });
  }
});

export default router; 