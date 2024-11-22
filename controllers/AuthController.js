import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import * as AuthService from '../services/AuthServices.js'; // Ensure AuthServices uses ES modules

// JWT Token Generator
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables.');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { mobile, date_of_birth, password, confirm_password, user_type } = req.body;

  const resolvedUserType = user_type || 'patient';

  if (password !== confirm_password) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check if user already exists
    const existingUser = await AuthService.findUserByMobile(mobile);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this mobile number already exists' });
    }

    // Register new user
    const user = await AuthService.registerUser({
      mobile,
      date_of_birth,
      password,
      user_type: resolvedUserType,
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { mobile, password } = req.body;

  try {
    // Find user by mobile
    const user = await AuthService.findUserByMobile(mobile);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user._id);
    res.status(200).json({ token, message: 'Login successful', user }); // i'll  add or remove user data  according to need to need later
    //all user data is send in response for now
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
