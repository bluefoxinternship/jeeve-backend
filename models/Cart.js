import mongoose from 'mongoose';

// Define the schema for items in the cart
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',  // Referencing the Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
}, { _id: false });

// Define the main cart schema
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Referencing the User model
    required: true,
  },
  items: [cartItemSchema], // Array of cart items
  totalPrice: {
    type: Number,
    default: 0,
  },
  totalQuantity: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

// Middleware to update totalPrice and totalQuantity before saving the cart
cartSchema.pre('save', function (next) {
  let totalPrice = 0;
  let totalQuantity = 0;

  // Calculate the total price and quantity of items in the cart
  this.items.forEach(item => {
    totalPrice += item.productPrice * item.quantity;
    totalQuantity += item.quantity;
  });

  // Assign total values to the cart
  this.totalPrice = totalPrice;
  this.totalQuantity = totalQuantity;

  next();
});

// Create the Cart model
const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
