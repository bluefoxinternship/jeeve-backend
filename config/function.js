import userModel from '../models/User.js';

// Convert string to Title Case
export const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Validate Email format
export const validateEmail = (mail) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(mail);
};

// Check if email exists in the database
export const emailCheckInDatabase = async (email) => {
  try {
    const user = await userModel.findOne({ email: email }).exec();
    return user ? true : false;  // If user is found, return true; otherwise false
  } catch (err) {
    throw new Error('Database query error');
  }
};

// Check if phone number exists in the database
export const phoneNumberCheckInDatabase = async (phoneNumber) => {
  try {
    const user = await userModel.findOne({ mobile: phoneNumber }).exec();
    return user ? true : false;  // If user is found, return true; otherwise false
  } catch (err) {
    throw new Error('Database query error');
  }
};
