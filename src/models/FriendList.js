import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { collection: 'friends' });

const FriendList = mongoose.models.FriendList || mongoose.model('FriendList', friendSchema);

export default FriendList;