import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Add to Cart
export const addToCart = async (req, res) => {
  const { id, quantity } = req.body; 
  const userId = req.user.id;

  if (!id || !quantity || quantity <= 0) {
    return res.status(400).json({
      status: "error",
      message: "ID and a valid quantity are required",
    });
  }

  try {
    const product = await Product.findById(id); 
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    if (quantity > product.countInStock) {
      return res.status(400).json({
        status: "error",
        message: `Only ${product.countInStock} item(s) in stock`,
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId });
    }

    const existingItem = cart.items.find(item => item.product.toString() === id); // Compare with 'id'

    if (existingItem) {
      if (existingItem.quantity + quantity > product.countInStock) {
        return res.status(400).json({
          status: "error",
          message: `Adding exceeds stock. Only ${product.countInStock - existingItem.quantity} item(s) can be added`,
        });
      }
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: id,
        quantity,
        productName: product.productName,
        productPrice: product.productPrice,
        productImage: product.productImage,
      });
    }

    await cart.save();

    return res.status(200).json({
      status: "success",
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Cart
export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product", "productName productPrice productImage category brand");
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Cart is empty",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Cart retrieved successfully",
      cart,
    });
  } catch (error) {
    console.error("Error retrieving cart:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
  const { id } = req.params; 
  const userId = req.user.id;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Product ID is required",
    });
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== id); // Compare with 'id'
    await cart.save();

    return res.status(200).json({
      status: "success",
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};

// Update Cart Item Quantity
export const updateCartItem = async (req, res) => {
  const { id} = req.params;
  const {quantity} = req.body; 
  const userId = req.user.id;

  if (!id || quantity == null || quantity < 0) {
    return res.status(400).json({
      status: "error",
      message: "Product ID and a valid quantity are required",
    });
  }

  try {
    const product = await Product.findById(id); 
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    if (quantity > product.countInStock) {
      return res.status(400).json({
        status: "error",
        message: `Only ${product.countInStock} item(s) in stock`,
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    const item = cart.items.find(item => item.product.toString() === id); // Compare with 'id'

    if (!item) {
      return res.status(404).json({
        status: "error",
        message: "Item not found in cart",
      });
    }

    item.quantity = quantity;

    if (item.quantity <= 0) {
      cart.items = cart.items.filter(item => item.product.toString() !== id);
    }

    await cart.save();

    return res.status(200).json({
      status: "success",
      message: "Cart item updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};
