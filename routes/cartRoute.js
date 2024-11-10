const express = require('express');
const Cart = require('../models/cart');
const Route = express.Router();

// Add a new product
Route.post('/', async (req, res) => {
  const { name, description,price} = req.body;
  try {
    const carts = new Cart({ name, description,price});
    await carts.save();
    res.status(201).json(carts);
  } catch (error) {
    res.status(500).json({ error: 'Error adding cart' });
  }
});

// Get all products
Route.get('/', async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching carts' });
  }
});

// Update a product by ID
Route.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description,price} = req.body;
  try {
    const carts = await Cart.findByIdAndUpdate(
      id,
      { name, description,price},
      { new: true }
    );
    if (!carts) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
});

// Delete a product by ID
Route.delete('/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const carts = await Cart.findByIdAndDelete(id);
    if (!carts) {
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
    let result=await Cart.findOne({_id:req.params.id})
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
    let result=await Cart.find({
        "$or":[
            {name:{$regex:req.params.key}}
        ]
    })
    res.send(result)
 });
module.exports = Route;
