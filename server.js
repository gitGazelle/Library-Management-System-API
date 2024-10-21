const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// API routes
app.get('/api/books', (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            console.error('Error fetching books:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/books', (req, res) => {
    const { title, author } = req.body;
    db.run('INSERT INTO books (title, author) VALUES (?, ?)', [title, author], function(err) {
        if (err) {
            console.error('Error adding book:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, (err) => {
    if (err) {
        console.error("Error starting server:", err);
        return;
    }
    console.log(`Server running on http://localhost:${PORT}`);
});
