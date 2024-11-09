const express = require('express');
const multer = require('multer');
const Product = require('../models/Products');

const Route = express.Router();
const storage = multer.memoryStorage();  // Store image in memory (as Buffer)
const upload = multer({ storage: storage });
// POST route to add a new product with an image upload
Route.post('/', upload.single('image'), async (req, res) => {
  const { name, description } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null; 

  try {
    const newProduct = new Product({
      name,
      description,
      image: {
        data: imageBuffer,
        contentType: req.file.mimetype, 
      },
    });
    await newProduct.save();
    res.status(201).json(newProduct); 
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ error: 'Error saving product' });
  }
});

// Get all products
Route.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Update a product by ID
Route.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description} = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, buttontext },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
});

// Delete a product by ID
Route.delete('/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});
// Get a product by ID
Route.get('/:id', async (req, res) => {
    try {
    let result=await Product.findOne({_id:req.params.id})
    if (result) {
        res.send(result)
    }else{
        res.send({result:'Error fetching product by id'})
    }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching product by id' });
    }
 });
//search api  
 Route.get('/search/:key', async (req, res) => {
    let result=await Product.find({
        "$or":[
            {name:{$regex:req.params.key}}
        ]
    })
    res.send(result)
 });
module.exports = Route;
