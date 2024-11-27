import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
    },
    productDetail: {
      type: String,
      required: [true, "Product detail is required"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    weight: {
      type: Number, // Weight in grams, kilograms, etc.
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "archived"], // Use enums for predefined statuses
      default: "active",
    },
    seoDescription: {
      type: String,
      maxLength: 160, // Typical SEO description length
    },
    seoTitle: {
      type: String,
      maxLength: 60, // Typical SEO title length
    },
    highlights: {
      type: [String], // Array of key highlights
      default: [],
    },
    color: {
      type: [String], // Array of colors (e.g., ["red", "blue"])
      default: [],
    },
    specifications: {
      type: Map, // Use a Map to store key-value pairs for specifications
      of: String,
    },
    productPrice: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be a positive number"],
    },
    discount: {
      isActive: {
        type: Boolean,
        default: false,
      },
      percentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    productImage: {
      type: String,
      required: [true, "Product image is required"],
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(v);
        },
        message: "Please enter a valid image URL",
      },
    },
    countInStock: {
      type: Number,
      required: [true, "Stock count is required"],
      min: [0, "Stock count cannot be negative"],
    },
    reviews: [reviewSchema],
    tags: {
      type: [String],
      default: [],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand is required"],
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories", 
      required: [true, "Product category is required"],
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      default: null,
    },
    childCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories", 
      default: null,
    },
  },
  { timestamps: true }
);

productSchema.virtual("discountedPrice").get(function () {
  if (
    this.discount.isActive &&
    this.discount.percentage > 0 &&
    (!this.discount.endDate || new Date() <= this.discount.endDate) &&
    (!this.discount.startDate || new Date() >= this.discount.startDate)
  ) {
    const discountAmount = (this.productPrice * this.discount.percentage) / 100;
    return Number((this.productPrice - discountAmount).toFixed(2));
  }
  return this.productPrice;
});

export default mongoose.model("Product", productSchema);
