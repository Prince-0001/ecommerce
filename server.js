const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
});

const Product = mongoose.model('Product', productSchema);

app.route('/api/products')
  .get(async (req, res) => {
    const products = await Product.find();
    res.json(products);
  })
  .post(async (req, res) => {
    const { name, price, quantity } = req.body;

    if (!name || !price || !quantity) {
      return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    const newProduct = new Product({ name, price, quantity });
    await newProduct.save();
    res.json(newProduct);
  });

app.route('/api/products/:id')
  .get(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json(product);
  })
  .put(async (req, res) => {
    const productId = req.params.id;
    const { name, price, quantity } = req.body;

    if (!name || !price || !quantity) {
      return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price, quantity },
      { new: true } 
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json(updatedProduct);
  })
  .delete(async (req, res) => {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json(deletedProduct);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
