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

// Example route with CORS enabled
app.get('/getJournal', async (req, res) => {
  try {

    const result = await pool.query('SELECT * FROM journal_entries');

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
app.post('/category', async (req, res) => {
  const {  category } = req.body;
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

// Endpoint to fetch all journal entries
app.get('/getJournal', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM journal ORDER BY date DESC');

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/getCategory', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM category');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

