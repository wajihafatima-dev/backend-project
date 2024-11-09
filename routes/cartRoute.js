const express = require('express');
const Cart = require('../models/cart');
const Route = express.Router();

// Add a new Cart
Route.post('/', async (req, res) => {
  const { title, description, price } = req.body;
  try {
    const Carts = new Cart({ title, description, price });
    await Carts.save();
    res.status(201).json(Carts);
  } catch (error) {
    res.status(500).json({ error: 'Error adding Cart' });
  }
});

// Get all Carts
Route.get('/', async (req, res) => {
  try {
    const Carts = await Cart.find();
    res.json(Carts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Carts' });
  }
});

// Update a Cart by ID
Route.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description,price} = req.body;
  try {
    const Cart = await Cart.findByIdAndUpdate(
      id,
      { name, description,price},
      { new: true }
    );
    if (!Cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(Cart);
  } catch (error) {
    res.status(500).json({ error: 'Error updating Cart' });
  }
});

// Delete a Cart by ID
Route.delete('/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const Cart = await Cart.findByIdAndDelete(id);
    if (!Cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json({ message: 'Cart deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Cart' });
  }
});
// Get a Cart by ID
Route.get('/:id', async (req, res) => {
    try {
    let result=await Cart.findOne({_id:req.params.id})
    if (result) {
        res.send(result)
    }else{
        res.send({result:'Error fetching Cart by id'})
    }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching Cart by id' });
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
