const Cart = require('../models/CartModel');

const addToCart = async (userId, productId, quantity) => {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  return cart;
};

const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(item => item.productId.toString() !== productId);

  await cart.save();
  return cart;
};

const updateCartItem = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
  } else {
    throw new Error('Product not found in cart');
  }

  await cart.save();
  return cart;
};

const getCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  return cart;
};
const clearCart = async (userId) => {
    const cart = await Cart.findOne({ userId });
  
    if (!cart) {
      throw new Error('Cart not found');
    }
  
    cart.items = [];
    await cart.save();
    return cart;
  };
  
module.exports = {
  addToCart,
  removeFromCart,
  updateCartItem,
  getCart,
  clearCart
};