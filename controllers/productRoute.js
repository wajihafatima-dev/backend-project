const express = require('express');
const Product = require('../models/Products');

const router = express.Router();

// Add a new product
router.post('/', async (req, res) => {
  const { name, description, price} = req.body;
  try {
    const product = new Product({ name, description, price});
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error adding product' });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Update a product by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, inStock } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, price, inStock },
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
router.delete('/:id', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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
  
router.get('/search/:key', async (req, res) => {
    let result=await Product.find({
        "$or":[
            {name:{$regex:req.params.key}}
        ]
    })
    res.send(result)
 });
module.exports = router;
