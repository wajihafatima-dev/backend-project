const express = require('express');
const Cart = require('../models/cart');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const multerStorageCloudinary = require('multer-storage-cloudinary').CloudinaryStorage;
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,       
  api_secret: process.env.CLOUDINARY_API_SECRET,  
});

const storage = new multerStorageCloudinary({
  cloudinary: cloudinary,
  params: {
    folder: 'cart-images', 
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif'], 
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    console.log('File:', req.file);
    console.log('Body:', req.body);

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    const image = req.file.path;  
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
    const image = req.file ? req.file.path : undefined;  // Use the new image if uploaded

    const updatedData = { name, description, price };
    if (image) updatedData.image = image;  // Update the image if a new one is uploaded

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
