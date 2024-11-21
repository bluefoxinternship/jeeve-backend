import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
      product_name: {
        type: String,
        required: true,
      },
      product_detail: {
        type: String,
        required: true,
      },
      product_price: {
        type: Number,
        required: true,
      },
      rating: {
        type: Number,
        default: 0,
      },
      numReviews: {
        type: Number,
        default: 0,
      },
  
      product_image: {
        type: String,
      required: true,
      },
      product_collection: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      countInStock: {
        type: Number,
        required: true,
      },
      reviews: [reviewSchema],
    },
    { timestamps: true }
  );
  module.exports = mongoose.model("Product", productSchema);