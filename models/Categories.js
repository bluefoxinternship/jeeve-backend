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
      ref: 'categories',
      default: null,
    },
    cImage: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(v);
        },
        message: 'Please enter a valid image URL (jpg, jpeg, png, webp, avif, gif, svg)',
      },
    },
  },
  { timestamps: true }
);

// Create and export the model
const categoryModel = mongoose.model('categories', categorySchema);

export default categoryModel;
