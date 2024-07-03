const express = require('express');
const connectToDatabase = require('./db'); // Import the database connection function
const app = express();

app.use(express.json());

// Define your endpoints
app.get('/api/data', async (req, res) => {
    try {
        const connection = await connectToDatabase(); // Establish database connection
        const [rows] = await connection.query('SELECT * FROM your_table');
        connection.end(); // Close the database connection
        res.json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/api/data', async (req, res) => {
    try {
        const connection = await connectToDatabase(); // Establish database connection
        const { column1, column2 } = req.body;
        await connection.query('INSERT INTO your_table (column1, column2) VALUES (?, ?)', [column1, column2]);
        connection.end(); // Close the database connection
        res.status(201).send('Data inserted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add more endpoints for PUT, DELETE, etc.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
