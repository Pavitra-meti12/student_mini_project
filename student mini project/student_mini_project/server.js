const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// FILE PATHS
const USERS_FILE = path.join(__dirname, 'users.json');
const MSG_FILE = path.join(__dirname, 'messages.json');

// Create file if missing
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
if (!fs.existsSync(MSG_FILE)) fs.writeFileSync(MSG_FILE, '[]');

/* ================================
         REGISTER ACCOUNT
================================= */
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.json({ success: false, msg: "All fields required" });

    let users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));

    // Check if user exists
    if (users.find(u => u.username === username))
        return res.json({ success: false, msg: "User already exists" });

    users.push({ username, password });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    res.json({ success: true });
});

/* ================================
              LOGIN
================================= */
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    let users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));

    const found = users.find(u => u.username === username && u.password === password);

    if (found) return res.json({ success: true });

    res.json({ success: false });
});

/* ================================
              CONTACT FORM
================================= */
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email)
        return res.json({ success: false });

    let list = JSON.parse(fs.readFileSync(MSG_FILE, 'utf8'));

    list.push({
        name,
        email,
        message,
        time: new Date().toISOString()
    });

    fs.writeFileSync(MSG_FILE, JSON.stringify(list, null, 2));

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
