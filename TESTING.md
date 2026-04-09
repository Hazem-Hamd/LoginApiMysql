# 🧪 Testing Guide

## Local Testing Setup

### 1. Copy your .env configuration
Make sure your `.env` file is in the root directory with your database credentials:

```bash
cp .env.example .env
# Edit .env with your actual database credentials
```

### 2. Start the server
```bash
npm install
npm start
```

You should see:
```
✅  Connected to MySQL database: defaultdb
✅  Users table ready.
🏛️  The Architectural Sanctuary
🚀  Server running at http://localhost:3000
```

### 3. Test API Endpoints

#### Option A: Using PowerShell Script
```powershell
.\test_api.ps1
```

This will automatically:
- ✅ Test health endpoint
- ✅ Create a new test user
- ✅ Login with the user
- ✅ Get user profile (protected endpoint)
- ✅ List all users (protected endpoint)

#### Option B: Using Browser
Open these in your browser:

1. **Home Page**: http://localhost:3000
2. **Sign Up**: http://localhost:3000/signup.html
   - Fill form with:
     - Full Name: John Doe
     - Email: john@example.com
     - Password: Password123
   - Click "Create Account"
   - You'll get a token (save it!)

3. **Login**: http://localhost:3000/login.html
   - Email: john@example.com
   - Password: Password123
   - Click "Sign In"

4. **Dashboard**: http://localhost:3000/dashboard.html
   - Shows your profile (requires being logged in)

#### Option C: Using curl/PowerShell

**Health Check:**
```bash
curl http://localhost:3000/api/health
```

**Sign Up:**
```bash
$body = @{
    full_name = "Jane Doe"
    email = "jane@example.com"
    password = "SecurePass123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/signup" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

**Login:**
```bash
$body = @{
    email = "jane@example.com"
    password = "SecurePass123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

$response.Content | ConvertFrom-Json | Select-Object -ExpandProperty token
```

**Get Current User (Protected):**
```bash
# Replace TOKEN with the token from login response
$token = "your-token-here"
Invoke-WebRequest -Uri "http://localhost:3000/api/me" `
  -Headers @{"Authorization"="Bearer $token"}
```

**List All Users (Protected):**
```bash
$token = "your-token-here"
Invoke-WebRequest -Uri "http://localhost:3000/api/users" `
  -Headers @{"Authorization"="Bearer $token"}
```

## Expected Responses

### Successful Sign Up
```json
{
  "success": true,
  "message": "Account created successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Successful Login
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Failed Validation
```json
{
  "success": false,
  "errors": {
    "email": "Please provide a valid email address.",
    "password": "Password must be at least 8 characters."
  }
}
```

## Common Issues

| Issue | Solution |
|-------|----------|
| "Network error" | Make sure `npm start` is running |
| "Cannot connect to database" | Check `.env` credentials and database is running |
| "Invalid token" | Token expired - login again to get a new one |
| "Email already exists" | Use a different email address |
| "Invalid email format" | Email must have @ and a domain |

## Test Checklist

- [ ] Server starts successfully
- [ ] Can access http://localhost:3000
- [ ] Sign up page works
- [ ] Can create new user account
- [ ] Can login with credentials
- [ ] Dashboard loads after login
- [ ] Protected API endpoints require token
- [ ] Logout clears token and redirects to login

---

**Ready to deploy?** See [README.md](README.md) for production deployment options.
