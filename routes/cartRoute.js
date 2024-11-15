const express = require('express');
const Cart = require('../models/cart');
const router = express.Router();
const multer = require('multer');

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

// Add a new cart item
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    // Log the uploaded file and request body
    console.log('File:', req.file);
    console.log('Body:', req.body);

    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const image = req.file.path;

    // Create a new cart item
    const newItem = new Cart({
      name,
      price,
      description,
      image,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('Error adding cart item:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Get all cart items
router.get('/', async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (error) {
    console.error('Error fetching carts:', error);
    res.status(500).json({ error: 'Error fetching carts' });
  }
});

// Get a single cart item by ID
router.get('/:id', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(cart);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Error fetching product by ID' });
  }
});

// Update a cart item by ID
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const image = req.file ? req.file.path : undefined; // Only update image if a new one is uploaded

    const updatedData = { name, description, price };
    if (image) updatedData.image = image; // Add image only if it's provided

    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedCart) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedCart);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  }
});

// Delete a cart item by ID
router.delete('/:id', async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error deleting product' });
  }
});

// Search for cart items
router.get('/search/:key', async (req, res) => {
  try {
    const result = await Cart.find({
      "$or": [
        { name: { $regex: req.params.key, $options: 'i' } }, // Case-insensitive search
        { description: { $regex: req.params.key, $options: 'i' } }
      ]
    });
    res.json(result);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Error searching products' });
  }
});

module.exports = router;
