const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'super-secret-key-for-vacancy-app';

app.use(cors());
app.use(express.json());

// Инициализация БД
const db = new sqlite3.Database('./vacancies.db', (err) => {
  if (err) console.error('DB Error:', err);
  else {
    console.log('Connected to SQLite database');
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      login TEXT UNIQUE,
      password TEXT,
      role TEXT,
      company_name TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS vacancies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      short_description TEXT,
      english_level TEXT,
      grade TEXT,
      tags TEXT,
      employer_id INTEGER,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vacancy_id INTEGER,
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(vacancy_id, user_id)
    )`);
  }
});

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post('/login', (req, res) => {
  const { login, password } = req.body;
  db.get('SELECT * FROM users WHERE login = ?', [login], async (err, user) => {
    if (err || !user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, login: user.login, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, login: user.login, role: user.role, companyName: user.company_name } });
  });
});

app.post('/signup', async (req, res) => {
  const { login, password, repeatPassword } = req.body;
  if (password !== repeatPassword) return res.status(400).json({ message: 'Passwords do not match' });
  const hashed = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (login, password, role) VALUES (?, ?, ?)', [login, hashed, 'seeker'], function(err) {
    if (err) return res.status(400).json({ message: 'User already exists' });
    const token = jwt.sign({ id: this.lastID, login, role: 'seeker' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: this.lastID, login, role: 'seeker' } });
  });
});

app.post('/company-signup', async (req, res) => {
  const { companyName, login, password, repeatPassword } = req.body;
  if (password !== repeatPassword) return res.status(400).json({ message: 'Passwords do not match' });
  const hashed = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (login, password, role, company_name) VALUES (?, ?, ?, ?)', [login, hashed, 'employer', companyName], function(err) {
    if (err) return res.status(400).json({ message: 'User already exists' });
    const token = jwt.sign({ id: this.lastID, login, role: 'employer', companyName }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: this.lastID, login, role: 'employer', companyName } });
  });
});

// --- VACANCIES ROUTES ---
app.get('/vacancies', authenticateToken, (req, res) => {
  const sql = `SELECT v.*, 
    (SELECT COUNT(*) FROM responses r WHERE r.vacancy_id = v.id) as response_count,
    (SELECT COUNT(*) FROM responses r WHERE r.vacancy_id = v.id AND r.user_id = ?) as user_responded
    FROM vacancies v WHERE v.is_active = 1 ORDER BY v.created_at DESC`;
  db.all(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

app.get('/vacancies/:id', authenticateToken, (req, res) => {
  const sql = `SELECT v.*, 
    (SELECT COUNT(*) FROM responses r WHERE r.vacancy_id = v.id) as response_count,
    (SELECT COUNT(*) FROM responses r WHERE r.vacancy_id = v.id AND r.user_id = ?) as user_responded
    FROM vacancies v WHERE v.id = ?`;
  db.get(sql, [req.user.id, req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  });
});

app.post('/vacancies', authenticateToken, (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ message: 'Forbidden' });
  const { title, description, englishLevel, grade, tags } = req.body;
  const shortDesc = description ? description.substring(0, 50) : '';
  const tagsStr = Array.isArray(tags) ? tags.join(', ') : tags;
  
  db.run(`INSERT INTO vacancies (title, description, short_description, english_level, grade, tags, employer_id) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`, 
    [title, description, shortDesc, englishLevel, grade, tagsStr, req.user.id], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ id: this.lastID, message: 'Created' });
  });
});

app.put('/vacancies/:id', authenticateToken, (req, res) => {
  const { isActive } = req.body;
  db.run('UPDATE vacancies SET is_active = ? WHERE id = ? AND employer_id = ?', [isActive ? 1 : 0, req.params.id, req.user.id], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    if (this.changes === 0) return res.status(403).json({ message: 'Not authorized or not found' });
    res.json({ message: 'Updated' });
  });
});

app.post('/vacancies/:id/response', authenticateToken, (req, res) => {
  if (req.user.role !== 'seeker') return res.status(403).json({ message: 'Forbidden' });
  db.run('INSERT OR IGNORE INTO responses (vacancy_id, user_id) VALUES (?, ?)', [req.params.id, req.user.id], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    if (this.changes === 0) return res.status(400).json({ message: 'Already responded' });
    res.json({ message: 'Responded' });
  });
});

app.delete('/vacancies/:id/response', authenticateToken, (req, res) => {
  db.run('DELETE FROM responses WHERE vacancy_id = ? AND user_id = ?', [req.params.id, req.user.id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Cancelled' });
  });
});

app.get('/my-vacancies', authenticateToken, (req, res) => {
  if (req.user.role !== 'seeker') return res.status(403).json({ message: 'Forbidden' });
  const sql = `SELECT v.*, (SELECT COUNT(*) FROM responses r WHERE r.vacancy_id = v.id) as response_count
    FROM vacancies v INNER JOIN responses r ON v.id = r.vacancy_id WHERE r.user_id = ? ORDER BY r.created_at DESC`;
  db.all(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

app.get('/active-vacancies', authenticateToken, (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ message: 'Forbidden' });
  const sql = `SELECT v.*, (SELECT COUNT(*) FROM responses r WHERE r.vacancy_id = v.id) as response_count
    FROM vacancies v WHERE v.employer_id = ? ORDER BY v.created_at DESC`;
  db.all(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));