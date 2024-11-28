import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  bio: { type: String },
  location: { type: String },
  website: { type: String },
  password: { type: String, required: true },
}, { collection: 'userinfo' });

const UserInfo = mongoose.models.UserInfo || mongoose.model('UserInfo', userSchema);

export default UserInfo;