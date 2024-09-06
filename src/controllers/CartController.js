const CartService = require('../services/CartService');

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await CartService.addToCart(userId, productId, quantity);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await CartService.removeFromCart(userId, productId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await CartService.updateCartItem(userId, productId, quantity);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await CartService.getCart(userId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const clearCart = async (req, res) => {
    try {
      const { userId } = req.body;
      const cart = await CartService.clearCart(userId);
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
module.exports = {
  addToCart,
  removeFromCart,
  updateCartItem,
  getCart,
  clearCart
};