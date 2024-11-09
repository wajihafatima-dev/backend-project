const express = require('express');
const Product = require('../models/Products');

const Route = express.Router();

// Add a new product
Route.post('/', async (req, res) => {
  const { name, description} = req.body;
  try {
    const product = new Product({ name, description});
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error adding product' });
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
      { name, description},
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
