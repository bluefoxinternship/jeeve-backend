import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define User Schema
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    default: null,
  },
  middle_name: {
    type: String,
    default: null,
  },
  last_name: {
    type: String,
    default: null,
  },
  date_of_birth: {
    type: Date,
    required: true, // Required for registration
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', null],
    default: null,
  },
  mobile: {
    type: String,
    required: true, // Required for registration
    unique: true,
  },
  home_phone: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
    unique: true, // Add uniqueness if email is to be made unique in the future
    sparse: true, // Allows null values to exist with unique constraint
  },
  address: {
    type: [String], // Array of addresses
    default: [],
  },
  blood_group: {
    type: String,
    default: null,
  },
  profile_image: {
    type: String, // URL or file path
    default: null,
  },
  inventory_reference: {
    type: String,
    default: null,
  },
  user_id: {
    type: String,
    default: null,
    unique: true, 
  },
  user_type: {
    type: String,
    enum: ['patient', 'admin', 'vendor', null],
    required: true,
   
  },
  referal_code: {
    type: String,
    default: null,
    
  },
  password: {
    type: String,
    required: true, // Required for registration
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
