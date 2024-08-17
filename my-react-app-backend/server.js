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

// POST endpoint to add entries
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