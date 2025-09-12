const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Replace this with your frontend URL
const FRONTEND_URL = "https://wings-cafe-frontend-9ov6zskn3-phalatsane-s-projects.vercel.app";

// CORS setup
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.options("*", cors()); // handle preflight requests

app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

// Helper functions
const readDB = () => {
  const data = JSON.parse(fs.readFileSync(dbPath));
  if (!data.stockTransactions) data.stockTransactions = [];
  if (!data.transactions) data.transactions = [];
  return data;
};
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// --- API DATA SUMMARY ---
app.get('/api/data', (req, res) => {
  const data = readDB();
  const sales = data.transactions.map(t => {
    const product = data.products.find(p => p.id === t.productId);
    return { ...t, productName: product ? product.name : "Unknown", price: product ? product.price : 0 };
  });
  res.json({ products: data.products, sales });
});

// --- DELETE PRODUCT ---
app.delete('/products/:id', (req, res) => {
  const data = readDB();
  const productIndex = data.products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });
  data.products.splice(productIndex, 1);
  writeDB(data);
  res.json({ message: 'Product deleted' });
});

// --- PRODUCTS ---
app.get('/products', (req, res) => {
  const data = readDB();
  res.json(data.products);
});

app.post('/products', (req, res) => {
  const data = readDB();
  const newProduct = req.body;
  const maxId = data.products.reduce((max, p) => Math.max(max, Number(p.id)), 0);
  newProduct.id = (maxId + 1).toString();
  data.products.push(newProduct);
  writeDB(data);
  res.json({ message: 'Product added!', product: newProduct });
});

// --- STOCK ADDITIONS ---
app.patch('/products/:id/add-stock', (req, res) => {
  const data = readDB();
  const product = data.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const quantity = Number(req.body.quantity);
  if (isNaN(quantity) || quantity <= 0) return res.status(400).json({ error: 'Invalid quantity' });

  product.quantity += quantity;

  const stockTransaction = {
    id: Date.now(),
    productId: product.id,
    productName: product.name,
    quantity,
    date: new Date().toISOString()
  };
  data.stockTransactions.push(stockTransaction);

  writeDB(data);
  res.json({ message: 'Stock added', stockTransaction });
});

app.get('/stock-transactions', (req, res) => {
  const data = readDB();
  const transactions = data.stockTransactions.map(t => {
    const product = data.products.find(p => p.id === t.productId);
    return { ...t, productName: product ? product.name : "Unknown" };
  });
  res.json(transactions);
});

// --- SALES ---
app.post('/sales', (req, res) => {
  const data = readDB();
  const { productId, quantity } = req.body;
  const product = data.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (product.quantity < quantity) return res.status(400).json({ error: 'Insufficient stock' });

  product.quantity -= Number(quantity);

  const sale = {
    id: Date.now(),
    productId,
    productName: product.name,
    quantity: Number(quantity),
    date: new Date().toISOString()
  };
  data.transactions.push(sale);

  writeDB(data);
  res.json({ message: 'Sale recorded', sale });
});

app.get('/sales', (req, res) => {
  const data = readDB();
  const result = data.transactions.map(t => {
    const product = data.products.find(p => p.id === t.productId);
    return { ...t, productName: product ? product.name : "Unknown" };
  });
  res.json(result);
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
