# 🏛️ The Architectural Sanctuary - Authentication API

A secure, modern authentication system with Express.js backend and MySQL database. Features user registration, login, JWT tokens, and a beautiful UI.

## ✨ Features

- **User Registration**: Create accounts with email validation
- **Secure Login**: Password hashing with bcryptjs
- **JWT Tokens**: Stateless authentication tokens
- **Protected Routes**: API endpoints that require authentication
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Database**: MySQL with automated schema creation

## 📋 Requirements

- **Node.js** 16+ 
- **npm** or **yarn**
- **MySQL Database** (local or cloud - tested with Aiven)

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Hazem-Hamd/LoginApiMysql.git
cd LoginApiMysql
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and add your database credentials:

```bash
cp .env.example .env
```

Edit `.env` with your values:
```
DB_HOST=your-database-host.com
DB_PORT=22828
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=your-database
DB_SSL=true
JWT_SECRET=your-secret-key
PORT=3000
```

### 3. Run Server

```bash
npm start
```

Server will start at **http://localhost:3000**

```
✅  Connected to MySQL database: your-database-name
✅  Users table ready.
🏛️  The Architectural Sanctuary
🚀  Server running at http://localhost:3000
```

## 🔗 Available Pages

- **Login**: http://localhost:3000/login.html
- **Sign Up**: http://localhost:3000/signup.html
- **Dashboard**: http://localhost:3000/dashboard.html (requires login)

## 🛠️ API Endpoints

### Public Endpoints

- **POST** `/api/signup` - Register new user
  ```json
  {
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```

- **POST** `/api/login` - User login
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```

- **GET** `/api/health` - Health check

### Protected Endpoints (Requires Bearer Token)

- **GET** `/api/me` - Get current user info
  ```bash
  curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/me
  ```

- **GET** `/api/users` - List all users
  ```bash
  curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/users
  ```

## 🧪 Testing with PowerShell

A test script is included: `test_api.ps1`

```powershell
.\test_api.ps1
```

This will:
- Test the health endpoint
- Create a test user
- Login with the test user
- Verify protected endpoints

## 🔐 Security Notes

- **.env file** is NOT committed to GitHub (protected by .gitignore)
- Use `.env.example` as a template
- Passwords are hashed with bcryptjs (12 rounds)
- JWT tokens expire after 7 days (configurable)
- HTTPS recommended for production
- SQL injection protected with parameterized queries

## 💾 Database Schema

Automatically created on startup:

```sql
CREATE TABLE users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  full_name    VARCHAR(255) NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 🌐 Deploy to Production

### Option 1: Railway (Recommended)
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select this repository
4. Add environment variables (`DB_HOST`, `DB_USER`, etc.)
5. Railway auto-detects Node.js and deploys

### Option 2: Render.com
1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Add environment variables
5. Deploy

### Option 3: Heroku
1. Install Heroku CLI
2. Run `heroku login` and `heroku create your-app-name`
3. Add buildpacks: `heroku buildpacks:add heroku/nodejs`
4. Set environment variables: `heroku config:set DB_HOST=...`
5. Deploy: `git push heroku main`

## 📂 Project Structure

```
├── server.js           # Express backend & API routes
├── login.html          # Login page
├── signup.html         # Registration page
├── dashboard.html      # Protected dashboard
├── index.html          # Home page
├── package.json        # Dependencies
├── .env.example        # Environment template
├── .gitignore          # Git security rules
└── db/
    └── schema.sql      # Database schema
```

## 🐛 Troubleshooting

**"Network error — is the server running?"**
- Make sure `npm start` is running
- Check if port 3000 is available
- Verify firewall settings

**"Cannot connect to database"**
- Check `.env` file has correct credentials
- Verify database is running and accessible
- Test connection with: `mysql -h HOST -u USER -p PASSWORD`

**"Invalid token"**
- Token may have expired (7 days)
- Try logging in again to get a new token

## 📝 License

MIT

---

**Need help?** Check the server console logs for detailed error messages.
