const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve file statis dari folder "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Koneksi ke MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,       // dari file .env
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Cek dan buat folder uploads jika belum ada
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Konfigurasi Multer untuk upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // simpan file di folder "uploads"
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Batas ukuran file 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, and GIF are allowed'));
    }
    cb(null, true);
  },
});

// ======================
// Middleware Autentikasi
// ======================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user; // Simpan info user yang berhasil diverifikasi
    next(); // lanjut ke route berikutnya
  });
};

// =================
// Endpoint Register
// =================
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  
  // Hash password sebelum disimpan
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Error hashing password' });

    db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ message: 'Error saving user' });
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching user' });
      if (results.length === 0) return res.status(400).json({ message: 'User not found' });
    
      const user = results[0];
      bcrypt.compare(password, user.password, (err, match) => {
        if (!match) return res.status(400).json({ message: 'Invalid password' });
    
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      });
    });
    
  });
});

// ===============
// Endpoint Login
// ===============
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user' });
    if (results.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = results[0];

    // Bandingkan password dengan yang di-hash
    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) return res.status(400).json({ message: 'Invalid password' });

      // Buat token JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

// ========================
// Endpoint Upload (Aman)
// ========================
app.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
  const userId = req.user.id; // dari token, bukan body
  const imageUrl = `/uploads/${req.file.filename}`;

  db.query(
    'INSERT INTO photos (user_id, image_url) VALUES (?, ?)',
    [userId, imageUrl],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error saving photo' });
      res.status(201).json({ message: 'Photo uploaded successfully', imageUrl });
    }
  );
});

// =========================
// Endpoint Lihat Foto User
// =========================
app.get('/profile/:userId', (req, res) => {
  const { userId } = req.params;

  db.query('SELECT * FROM photos WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching photos' });
    res.json(results);
  });
});

// =================
// Jalankan Server
// =================
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
