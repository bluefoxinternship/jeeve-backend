import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    cName: {
      type: String,
      required: true,
      trim: true,
    },
    cDescription: {
      type: String,
      required: true,
      trim: true,
    },
    cStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categories', // References the same category model
      default: null, // Null for main categories, will be the parent ID for subcategories
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the model
const categoryModel = mongoose.model('categories', categorySchema);

export default categoryModel;
