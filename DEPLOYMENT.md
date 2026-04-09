# 🚀 One-Click Deployment Guide

Deploy **The Architectural Sanctuary** to the cloud in minutes!

## 🎯 Fastest Option: Railway (Recommended)

Railway is the easiest - zero configuration needed!

### Click to Deploy:
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new?repo=https://github.com/Hazem-Hamd/LoginApiMysql&referralCode=VmxNUk)

**Steps:**
1. Click the button above
2. Connect your GitHub account
3. Click "Deploy"
4. Add environment variables (see below)
5. Done! 🎉

### Environment Variables for Railway:
After deployment, add these in Railway's dashboard:

```
DB_HOST=mysql-xxxxx.j.aivencloud.com
DB_PORT=22828
DB_USER=avnadmin
DB_PASSWORD=your-password-here
DB_NAME=defaultdb
DB_SSL=true
JWT_SECRET=your-secret-key-here
PORT=3000
```

Your app will be live at: `https://your-app-name.railway.app`

---

## 🔵 Alternative: Render.com

### Click to Deploy:
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Hazem-Hamd/LoginApiMysql)

**Steps:**
1. Click the button above
2. Connect GitHub
3. Fill in environment variables
4. Click "Deploy"

Your app will be live at: `https://your-app-name.onrender.com`

---

## 🟩 Alternative: Heroku

### Manual Deployment:

```bash
# 1. Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli

# 2. Login to Heroku
heroku login

# 3. Create a new app
heroku create your-sanctuary-app

# 4. Add environment variables
heroku config:set DB_HOST=mysql-xxxxx.j.aivencloud.com
heroku config:set DB_PORT=22828
heroku config:set DB_USER=avnadmin
heroku config:set DB_PASSWORD=your-password
heroku config:set DB_NAME=defaultdb
heroku config:set DB_SSL=true
heroku config:set JWT_SECRET=your-secret-key

# 5. Deploy from GitHub
# Go to: https://dashboard.heroku.com/apps/your-sanctuary-app
# Connect to GitHub > select this repo > Click Deploy
```

Your app will be live at: `https://your-sanctuary-app.herokuapp.com`

---

## ⚙️ Environment Variables Needed

| Variable | Example | Notes |
|----------|---------|-------|
| `DB_HOST` | `mysql-37b9b27c-xxx.j.aivencloud.com` | Your database host |
| `DB_PORT` | `22828` | Port number |
| `DB_USER` | `avnadmin` | Database username |
| `DB_PASSWORD` | `AVNS_0vNoMkgVk4l...` | Database password |
| `DB_NAME` | `defaultdb` | Database name |
| `DB_SSL` | `true` | Enable SSL connection |
| `JWT_SECRET` | `any-secret-string` | Change this in production! |
| `JWT_EXPIRES_IN` | `7d` | Token expiration |
| `PORT` | `3000` | Port to run on |

---

## 🧪 Test Your Deployment

Once deployed, test with:

```bash
# Health check
curl https://your-app-name.railway.app/api/health

# Sign up
curl -X POST https://your-app-name.railway.app/api/signup \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","email":"test@example.com","password":"TestPass123"}'

# Login
curl -X POST https://your-app-name.railway.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

---

## 📲 Access Your App

After deployment, your app URLs will be:

**Login Page:**
```
https://your-app-name.railway.app/login.html
```

**Sign Up Page:**
```
https://your-app-name.railway.app/signup.html
```

**Dashboard:**
```
https://your-app-name.railway.app/dashboard.html
```

---

## 🔄 Update Deployment

After making code changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Your deployment will update automatically! (if you connected GitHub)

---

## 🚨 Important Security Notes

✅ **DO:**
- Change `JWT_SECRET` to a random string in production
- Use strong database passwords
- Enable SSL/TLS for all connections
- Set environment variables in your deployment platform

❌ **DON'T:**
- Commit `.env` file to GitHub
- Use same password as development
- Share API tokens
- Use `localhost` in production URLs

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot connect to database" | Check all DB_* environment variables are correct |
| "Port already in use" | The platform assigns the PORT automatically |
| "Application crashed" | Check the logs in your deployment dashboard |
| "CORS errors" | Already enabled in the server code |
| "Token invalid" | Token expires after 7 days, login again |

---

## 💰 Cost

| Platform | Free Tier | Best For |
|----------|-----------|----------|
| **Railway** | $5/month free | Best value, easy setup |
| **Render** | Limited free tier | Full free included |
| **Heroku** | No free tier | Stable, professional |

---

## 📚 Next Steps

1. **Deploy** using one of the options above
2. **Test** by signing up and logging in
3. **Share** your app URL with others
4. **Monitor** logs in your deployment dashboard
5. **Update** by pushing to GitHub (auto-deploys if set up)

---

**Ready to go live?** Click the Railway button above! 🚀
