import mongoose, { Mongoose } from "mongoose";

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
    productPrice: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be a positive number"],
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
      type: String,
      required: [true, "Brand is required"],
    },
  },
  { timestamps: true }
);


export default mongoose.model("Product", productSchema);
