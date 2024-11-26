// models/Brand.js
import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String, // URL for the image uploaded to Cloudinary
      required: true
    }
  },
  { timestamps: true }
);

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
