const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Inisialisasi dotenv untuk mengakses variabel lingkungan (env)
dotenv.config();

// Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware untuk menangani CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Middleware untuk parsing JSON dan URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyajikan file statis dari folder "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Koneksi ke MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Cek koneksi ke MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Membuat folder "uploads" jika belum ada
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
    cb(null, uniqueName); // Menambahkan timestamp untuk nama file unik
  },
});

// Batasan ukuran file upload (5MB) dan filter tipe file
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
// untuk memverifikasi JWT token pada setiap request yang memerlukan autentikasi
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user; // Menyimpan info user yang berhasil diverifikasi
    next(); // lanjut ke route berikutnya
  });
};

// =================
// Endpoint Register (Registrasi User oleh Admin)
// =================
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password harus diisi' });
  }

  // Hash password sebelum disimpan
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Error hashing password' });

    const role = 'user';  // Default role
    db.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Username already taken' });
          }
          return res.status(500).json({ message: 'Error saving user' });
        }

        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
});

// ===============
// Endpoint Login (Login User)
// ===============
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username);

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user' });
    if (results.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = results[0];

    // Bandingkan password dengan yang di-hash
    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) return res.status(400).json({ message: 'Invalid password' });

      // Buat token JWT
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, userId: user.id,role: user.role });
    });
  });
});


// ========================
// Endpoint Upload
// ========================
app.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
  const userId = req.user.id; // dari token, bukan body
  const imageUrl = `/uploads/${req.file.filename}`; // URL file yang diupload

  db.query(
    'INSERT INTO photos (user_id, image_url) VALUES (?, ?)',
    [userId, imageUrl],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error saving photo' });
      // Mengirim response dengan URL profile untuk redirect
      res.status(201).json({ 
        message: 'Photo uploaded successfully', 
        imageUrl,
        redirectTo: `/profile/${userId}`  // URL untuk profile pengguna
      });
    }
  );
});

// =========================
// Endpoint Lihat Foto User
// =========================
app.get('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = 'SELECT * FROM photos WHERE user_id = ?'; // Ambil semua foto user
  const params = [userId];
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("SQL error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.json(result); // Kirim array foto
  });
  
});


/// ======================
// Endpoint Mengambil semua user (hanya admin untuk di admin panel)
// ======================
app.get('/users', authenticateToken, (req, res) => {
  // Cek apakah pengguna adalah admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access forbidden: only admins can access this resource' });
  }

  // Query untuk mengambil semua data pengguna
  db.query('SELECT id, username, role FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users' });
    res.json(results);
  });
});

// ======================
// Endpoint mengambil data user berdasarkan ID
// ======================
app.get('/users/:userId', authenticateToken, (req, res) => {
  const { userId } = req.params;

  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user data' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json(results[0]);  // Mengembalikan data user
  });
});


// ======================
// Endpoint Update User
// ======================
app.put('/users/:id', (req, res) => {
  const { id } = req.params;  // ID user yang akan diupdate
  const { username, password, role } = req.body;  // Data yang akan diupdate

  if (!username) {
    return res.status(400).json({ message: 'Username harus diisi' });
  }

  // Jika password diberikan, hash password tersebut
  const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;

  // Query untuk update user
  const query = 'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?';
  const values = [
    username || null, 
    hashedPassword || null, 
    role || null, 
    id
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating user', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  });
});


// Endpoint untuk menghapus user berdasarkan ID
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;  // ID user yang akan dihapus

  // Query untuk menghapus user
  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting user', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  });
});


// =================
// Jalankan Server
// =================
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
