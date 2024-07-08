const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS middleware

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM profiles');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Endpoint to insert a new journal entry
app.post('/journal', async (req, res) => {
  const { title, content, category, date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO journal (title, content, category, date) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, category, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Endpoint to fetch all journal entries
app.get('/journal', async (req, res) => {
  const { start, end } = req.query;

  try {
    let query = 'SELECT * FROM journal';
    let queryParams = [];

    if (start && end) {
      query += ' WHERE date >= $1 AND date <= $2';
      queryParams = [start, end];
    }

    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint to insert a new category
app.post('/category', async (req, res) => {
  const { category } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO category (category) VALUES ($1) RETURNING *',
      [category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Endpoint to fetch all categories
app.get('/category', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM category');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.delete('/journal/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM journal WHERE id = $1', [id]);

    if (result.rowCount > 0) {
      res.status(200).send(`Journal entry with ID ${id} deleted successfully`);
    } else {
      res.status(404).send(`Journal entry with ID ${id} not found`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
app.put('/journal/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, category, date } = req.body;

  try {
    const result = await pool.query(
      'UPDATE journal SET title = $1, content = $2, category = $3, date = $4 WHERE id = $5 RETURNING *',
      [title, content, category, date, id]
    );

    if (result.rowCount > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send(`Journal entry with ID ${id} not found`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
