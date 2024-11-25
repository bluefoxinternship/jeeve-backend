import express from 'express';
import {  updateProfile, getProfile, changePassword, addAddress, removeAddress, viewShipmentDetails } from '../controllers/UserController.js';
import { 
  validateUpdateProfile, 
  validateChangePassword, 
  validateAddAddress, 
  validateShipmentDetails,
  validateResults,
} from '../validation/UserValidation.js'; 
import { isUser } from '../middlewares/AuthMiddleware.js';

const router = express.Router();


// Get User Profile Route (protected)
router.get('/profile', isUser, getProfile);

// Update User Profile Route (protected)
router.put('/profile', isUser, validateUpdateProfile, validateResults, updateProfile);

// Change Password Route (protected)
router.put('/change-password', isUser, validateChangePassword, validateResults, changePassword);

// Add Address Route (protected)
router.post('/address', isUser, validateAddAddress, validateResults, addAddress);

// Remove Address Route (protected)
router.delete('/address/:address_id', isUser, removeAddress);

// View Shipment Details Route (protected)
router.get('/shipment-details', isUser, validateShipmentDetails, validateResults, viewShipmentDetails);

export default router;
