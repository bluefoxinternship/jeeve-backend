import { validationResult } from 'express-validator';
import User from '../models/User.js';


export const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.user.id;
  const updatedData = req.body; // Get updated data from the request body

  try {
    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', updatedUser });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


export const getProfile = async (req, res) => {
  const userId = req.user.id; // User ID is attached from the JWT token

  try {
    const user = await User.findById(userId).select('-password'); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.user.id;
  const { current_password, new_password, confirm_password } = req.body;

  if (new_password !== confirm_password) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(current_password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = new_password;
    await user.save(); // Save the updated password

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


export const addAddress = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const userId = req.user.id;
    const { address_label, area, city, state, country, landmark, alternate_number } = req.body;
  
    const newAddress = {
      address_label,
      area,
      city,
      state,
      country,
      landmark,
      alternate_number,
    };
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.address.push(newAddress);
      await user.save();
  
      const addedAddress = user.address[user.address.length - 1];
  
      res.status(200).json({ 
        message: 'Address added successfully', 
        address: addedAddress 
      });
    } catch (error) {
      console.error('Add Address Error:', error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  

export const removeAddress = async (req, res) => {
  const { address_id } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addressIndex = user.address.findIndex((addr) => addr._id.toString() === address_id);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    user.address.splice(addressIndex, 1);
    await user.save();

    res.status(200).json({ message: 'Address removed successfully' });
  } catch (error) {
    console.error('Remove Address Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


export const viewShipmentDetails = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('shipment_details'); // Fetch only shipment details

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ shipment_details: user.shipment_details });
  } catch (error) {
    console.error('View Shipment Details Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
