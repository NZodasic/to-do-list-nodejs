const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');

const app = express();
const port = 3000;

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse POST requests
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
    db.query('SELECT * FROM tasks', (err, allTasks) => {
        if (err) throw err;
        res.render('index', { allTasks });
    });
});

app.post('/add', (req, res) => {
    const taskName = req.body.taskName;
    const sql = 'INSERT INTO tasks (task_name) VALUES (?)';
    db.query(sql, [taskName], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.post('/complete/:id', (req, res) => {
    const taskId = req.params.id;
    const sql = 'UPDATE tasks SET completed = true WHERE id = ?';
    db.query(sql, [taskId], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});
app.post('/delete/:id', (req, res) => {
    const taskId = req.params.id;
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.query(sql, [taskId], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});


// Server listening
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


module.exports = app;
