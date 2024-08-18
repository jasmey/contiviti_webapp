const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

console.log('Starting server...');

// Middleware
app.use(bodyParser.json());
app.use(cors());

console.log('Middleware set up.');

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

console.log('Database initialized.');

// Create a table
db.serialize(() => {
    db.run("CREATE TABLE entries (id INTEGER PRIMARY KEY AUTOINCREMENT, entry_date TEXT NOT NULL, content TEXT NOT NULL)");

    // Insert initial data
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    db.run("INSERT INTO entries (entry_date, content) VALUES (?, ?)", [today.toISOString().split('T')[0], 'Entry for today']);
    db.run("INSERT INTO entries (entry_date, content) VALUES (?, ?)", [yesterday.toISOString().split('T')[0], 'Entry for yesterday']);
    db.run("INSERT INTO entries (entry_date, content) VALUES (?, ?)", [twoDaysAgo.toISOString().split('T')[0], 'Entry for two days ago']);
});

//fetch entries by date
app.get('/entries/:date', (req, res) => {
    const { date } = req.params;
    db.get(`SELECT * FROM entries WHERE entry_date = ?`, [date], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: "success",
            data: row
        });
    });
});

// POST endpoint to add entries
app.post('/entries', (req, res) => {
    const { content, entry_date } = req.body;

    console.log('Received content:', content); // Debug log
    console.log('Received entry_date:', entry_date); // Debug log

    if (!content || !entry_date) {
        return res.status(400).json({ error: "Content and entry date are required" });
    }

    db.run(`INSERT INTO entries (content, entry_date) VALUES (?, ?)`, [content, entry_date], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({
            message: "success",
            data: { id: this.lastID, content, entry_date }
        });
    });
});

// PUT endpoint to update entries
app.put('/entries', (req, res) => {
    const { content, entry_date } = req.body;

    console.log('Received content:', content); // Debug log
    console.log('Received entry_date:', entry_date); // Debug log

    if (!content || !entry_date) {
        return res.status(400).json({ error: "Content and entry date are required" });
    }

    db.run(`UPDATE entries SET content = ? WHERE entry_date = ?`, [content, entry_date], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(200).json({
            message: "success",
            data: { content, entry_date }
        });
    });
});

// DELETE endpoint to delete entries
app.delete('/entries/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM entries WHERE id = ?`, id, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "deleted",
            "data": { id }
        });
    });
});


// API endpoints
// Fetch entries
app.get('/entries', (req, res) => {
    db.all("SELECT * FROM entries", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

app.post('/entries', (req, res) => {
    const { content } = req.body;
    db.run(`INSERT INTO entries (content) VALUES (?)`, [content], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": { id: this.lastID, content }
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});