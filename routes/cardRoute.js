const express = require('express');
const Card = require('../models/cards');

const Route = express.Router();

// Add a new Card
Route.post('/', async (req, res) => {
  const { name, description, buttontext} = req.body;
  try {
    const cards = new Card({ name, description, buttontext});
    await cards.save();
    res.status(201).json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Error adding Card' });
  }
});

// Get all Cards
Route.get('/', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Cards' });
  }
});

// Update a Card by ID
Route.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, inStock } = req.body;
  try {
    const Card = await Card.findByIdAndUpdate(
      id,
      { name, description, price, inStock },
      { new: true }
    );
    if (!Card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(Card);
  } catch (error) {
    res.status(500).json({ error: 'Error updating Card' });
  }
});

// Delete a Card by ID
Route.delete('/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const Card = await Card.findByIdAndDelete(id);
    if (!Card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Card' });
  }
});
// Get a Card by ID
Route.get('/:id', async (req, res) => {
    try {
    let result=await Card.findOne({_id:req.params.id})
    if (result) {
        res.send(result)
    }else{
        res.send({result:'Error fetching Card by id'})
    }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching Card by id' });
    }
 });
//search api  
 Route.get('/search/:key', async (req, res) => {
    let result=await Card.find({
        "$or":[
            {name:{$regex:req.params.key}}
        ]
    })
    res.send(result)
 });
module.exports = Route;
