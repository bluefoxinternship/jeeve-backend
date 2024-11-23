// services/AuthService.js
import User from '../models/UserModel.js'; // Import User model using ES module syntax

// Find user by mobile number
export const findUserByMobile = async (mobile) => {
  return await User.findOne({ mobile });
};

// Register a new user
export const registerUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};
