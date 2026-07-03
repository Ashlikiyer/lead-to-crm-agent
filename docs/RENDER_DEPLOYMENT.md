# Deploying to Render

This guide will help you deploy your Lead-to-CRM backend to Render for free.

---

## Prerequisites

- ✅ GitHub account
- ✅ Your code pushed to GitHub
- ✅ All environment variables from your `.env` file

---

## Step 1: Push Code to GitHub

### If you haven't already:

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Lead to CRM automation"

# Create GitHub repo and push
# (Follow GitHub's instructions after creating the repo)
git remote add origin https://github.com/YOUR_USERNAME/lead-to-crm-agent.git
git branch -M main
git push -u origin main
```

---

## Step 2: Sign Up for Render

1. Go to [Render.com](https://render.com)
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with your **GitHub account** (easiest option)
4. Authorize Render to access your GitHub repositories

---

## Step 3: Create Web Service

### 3.1: Start New Service
1. In Render dashboard, click **"New +"** button (top right)
2. Select **"Web Service"**

### 3.2: Connect Repository
1. You'll see a list of your GitHub repos
2. Find **"lead-to-crm-agent"** (or your repo name)
3. Click **"Connect"**

### 3.3: Configure Service

Fill in these settings:

**Basic Settings:**
- **Name:** `lead-crm-agent` (or any name you prefer)
- **Region:** Choose closest to you (e.g., Oregon, Singapore)
- **Branch:** `main`
- **Root Directory:** Leave blank (or `.` if needed)
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Type:**
- Select **"Free"** (free tier is perfect for this project)

---

## Step 4: Add Environment Variables

Scroll down to the **"Environment Variables"** section.

Click **"Add Environment Variable"** for each of these:

```
GROQ_API_KEY=your_groq_key_here
AIRTABLE_TOKEN=your_airtable_token_here
AIRTABLE_BASE_ID=your_base_id_here
AIRTABLE_TABLE_NAME=Leads
SLACK_WEBHOOK_URL=your_slack_webhook_url_here
PORT=5000
NODE_ENV=production
```

**IMPORTANT:** Copy these values from your local `.env` file!

---

## Step 5: Deploy

1. Click **"Create Web Service"** at the bottom
2. Render will start deploying your app
3. You'll see a build log - wait for it to complete (2-5 minutes)
4. Look for: **"Your service is live 🎉"**

---

## Step 6: Get Your App URL

Once deployed:
1. Your URL will be at the top: `https://lead-crm-agent.onrender.com`
2. **Copy this URL** - you'll need it for Apps Script

---

## Step 7: Test Your Deployment

Test the health endpoint:

```bash
curl https://your-app-name.onrender.com/health
```

You should see:
```json
{
  "status": "healthy",
  "uptime": 12.345,
  "timestamp": "2026-07-03T..."
}
```

Test the webhook:

```bash
curl -X POST https://your-app-name.onrender.com/webhook/test \
  -H "Content-Type: application/json"
```

Should return success with lead processing details.

---

## Step 8: Update Apps Script

Now update your Google Apps Script with the production URL:

1. Open your Apps Script editor
2. Find line 8: `const WEBHOOK_URL = 'http://localhost:5000/webhook/lead';`
3. Replace with: `const WEBHOOK_URL = 'https://your-app-name.onrender.com/webhook/lead';`
4. **Save** the script

---

## Step 9: Test End-to-End

1. Go to your Google Form
2. Submit a test entry
3. Check within seconds:
   - ✅ Google Sheet (new row)
   - ✅ Airtable (new record)
   - ✅ Slack (notification)

**Everything should work now!**

---

## 🎉 Success Checklist

- ✅ Code deployed to Render
- ✅ Service is live with public URL
- ✅ Health endpoint responds
- ✅ Test endpoint works
- ✅ Apps Script updated with production URL
- ✅ Form submission triggers full automation
- ✅ Lead appears in Airtable
- ✅ Slack notification received

---

## 💡 Render Free Tier Notes

**What's included:**
- 750 hours/month of runtime (plenty for this project)
- Automatic HTTPS
- Auto-deploy on git push
- Build logs and monitoring

**Important:**
- **Service sleeps after 15 minutes of inactivity**
- First request after sleep takes 30-60 seconds to wake up
- Subsequent requests are instant
- This is normal for free tier - perfect for demos!

---

## 🔧 Troubleshooting

### Build fails
- Check that `package.json` is in the root directory
- Verify `npm install` works locally
- Check Render build logs for specific errors

### Service starts but crashes
- Check environment variables are set correctly
- View logs in Render dashboard
- Test locally first with `npm start`

### Webhook doesn't work
- Verify the URL in Apps Script is correct
- Check Render logs for incoming requests
- Test with curl first before using the form

---

## 🚀 Next Steps

Once deployed:
1. Share your Google Form publicly
2. Collect real leads
3. Watch the automation work in real-time
4. Consider adding the optional dashboard

**Your Lead-to-CRM automation is now live!**