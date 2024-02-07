const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'crud_demo',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.use(bodyParser.json());

// CRUD operations

// Create an item
app.post('/items', (req, res) => {
  const { name, description } = req.body;
  const sql = 'INSERT INTO items (name, description) VALUES (?, ?)';
  db.query(sql, [name, description], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: result.insertId, name, description });
    }
  });
});

// Read all items
app.get('/items', (req, res) => {
  const sql = 'SELECT * FROM items';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Read a specific item
app.get('/items/:id', (req, res) => {
  const itemId = req.params.id;
  const sql = 'SELECT * FROM items WHERE id = ?';
  db.query(sql, [itemId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Item not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// Update an item
app.put('/items/:id', (req, res) => {
  const itemId = req.params.id;
  const { name, description } = req.body;
  const sql = 'UPDATE items SET name = ?, description = ? WHERE id = ?';
  db.query(sql, [name, description, itemId], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: itemId, name, description });
    }
  });
});

// Delete an item
app.delete('/items/:id', (req, res) => {
  const itemId = req.params.id;
  const sql = 'DELETE FROM items WHERE id = ?';
  db.query(sql, [itemId], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Item deleted successfully' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
