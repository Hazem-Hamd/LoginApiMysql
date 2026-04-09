// ============================================================
//  The Architectural Sanctuary — Express + MySQL Backend
// ============================================================
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static HTML/CSS/JS files from the root folder
app.use(express.static(path.join(__dirname)));

// ── MySQL Connection Pool ────────────────────────────────────
let db;

async function connectDB() {
  try {
    db = await mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sanctuary_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // Aiven requires SSL for all connections
      ssl: {
        rejectUnauthorized: false,
      },
    });

    // Verify the connection works
    await db.query('SELECT 1');
    console.log('✅  Connected to MySQL database:', process.env.DB_NAME || 'sanctuary_db');

    // Auto-create the users table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          INT          AUTO_INCREMENT PRIMARY KEY,
        full_name   VARCHAR(255) NOT NULL,
        email       VARCHAR(255) NOT NULL UNIQUE,
        password    VARCHAR(255) NOT NULL,
        created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
        updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅  Users table ready.');
  } catch (err) {
    console.error('❌  MySQL connection failed:', err.message);
    console.error('   → Check your .env file (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)');
    process.exit(1);
  }
}

// ── JWT Helper ───────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || 'sanctuary_dev_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// ── Auth Middleware ──────────────────────────────────────────
function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

// ── Validation Helpers ───────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Routes ──────────────────────────────────────────────────

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Sanctuary API is running 🏛️' });
});

// ── POST /api/signup ─────────────────────────────────────────
app.post('/api/signup', async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    // ── Validate inputs ──
    const errors = {};
    if (!full_name || full_name.trim().length < 2) {
      errors.full_name = 'Full name must be at least 2 characters.';
    }
    if (!email || !isValidEmail(email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!password || password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ success: false, errors });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = full_name.trim();

    // ── Check for duplicate email ──
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [cleanEmail]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        errors: { email: 'An account with this email already exists.' },
      });
    }

    // ── Hash password & insert ──
    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
      [cleanName, cleanEmail, hash]
    );

    const userId = result.insertId;
    const token = signToken({ id: userId, email: cleanEmail, full_name: cleanName });

    console.log(`👤  New user signed up: ${cleanEmail} (id=${userId})`);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: { id: userId, full_name: cleanName, email: cleanEmail },
    });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ── POST /api/login ──────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Validate inputs ──
    const errors = {};
    if (!email || !isValidEmail(email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ success: false, errors });
    }

    const cleanEmail = email.trim().toLowerCase();

    // ── Look up user ──
    const [rows] = await db.query(
      'SELECT id, full_name, email, password FROM users WHERE email = ?',
      [cleanEmail]
    );

    if (rows.length === 0) {
      // Generic message — don't reveal whether email exists
      return res.status(401).json({
        success: false,
        errors: { email: 'Invalid email or password.' },
      });
    }

    const user = rows[0];

    // ── Verify password ──
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        errors: { password: 'Invalid email or password.' },
      });
    }

    // ── Issue token ──
    const token = signToken({ id: user.id, email: user.email, full_name: user.full_name });

    console.log(`🔐  User logged in: ${user.email} (id=${user.id})`);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email },
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ── GET /api/me ───────────────────────────────────────────────
// Protected route — returns current user's info
app.get('/api/me', authRequired, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, full_name, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ── GET /api/users ─────────────────────────────────────────────
// Admin view — list all registered users (for dev/testing)
app.get('/api/users', authRequired, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, full_name, email, created_at FROM users ORDER BY created_at DESC'
    );
    return res.json({ success: true, count: rows.length, users: rows });
  } catch (err) {
    console.error('Users list error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ── Catch-all: serve index.html for client-side routing ──────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('');
    console.log('🏛️  The Architectural Sanctuary');
    console.log(`🚀  Server running at http://localhost:${PORT}`);
    console.log('');
    console.log('   Pages:');
    console.log(`   • Login    → http://localhost:${PORT}/login.html`);
    console.log(`   • Sign Up  → http://localhost:${PORT}/signup.html`);
    console.log(`   • Dashboard→ http://localhost:${PORT}/dashboard.html`);
    console.log('');
    console.log('   API Endpoints:');
    console.log(`   • POST /api/signup`);
    console.log(`   • POST /api/login`);
    console.log(`   • GET  /api/me  (requires Bearer token)`);
    console.log(`   • GET  /api/users (requires Bearer token)`);
    console.log(`   • GET  /api/health`);
    console.log('');
  });
});
