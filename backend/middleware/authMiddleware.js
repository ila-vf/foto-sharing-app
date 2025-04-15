const jwt = require('jsonwebtoken');

// Middleware untuk verifikasi token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Format token: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next(); // lanjut ke handler berikutnya
  });
};

module.exports = authenticateToken;
