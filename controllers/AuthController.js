import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import * as AuthService from '../services/AuthServices.js'; // Use import instead of require

// JWT Token Generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register User
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { mobile, date_of_birth, password, confirm_password, user_type } = req.body;

  const resolvedUserType = user_type || "patient";

  // Check if password and confirm_password match
  if (password !== confirm_password) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existingUser = await AuthService.findUserByMobile(mobile);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this mobile number already exists' });
    }

    const user = await AuthService.registerUser({
      mobile,
      date_of_birth,
      password,
      user_type: resolvedUserType,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { mobile, password } = req.body;

  try {
    const user = await AuthService.findUserByMobile(mobile);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
