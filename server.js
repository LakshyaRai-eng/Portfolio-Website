require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Lakshya123',
    database: process.env.DB_NAME || 'portfolio_db',
    connectionLimit: 10
});

// Test connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL database \n(Make sure MySQL is running and password is correct): ', err.message);
    } else {
        console.log('Connected to MySQL database!');
        connection.release();
    }
});

// Contact Route
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
    db.query(query, [name, email, message], (err, results) => {
        if (err) {
            console.error('Error saving contact message:', err);
            if (err.code === 'ER_NO_SUCH_TABLE') {
                return res.status(500).json({ error: 'Database table not found. Please run setup_db.sql first.' });
            }
            return res.status(500).json({ error: 'Failed to save message.' });
        }
        res.status(201).json({ success: 'Message sent successfully!' });
    });
});

// Fallback to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
