# Complete Setup Guide

This guide walks you through setting up the Lead-to-CRM Automation Agent from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Groq API Setup](#groq-api-setup)
3. [Airtable Setup](#airtable-setup)
4. [Slack Setup](#slack-setup)
5. [Google Forms Setup](#google-forms-setup)
6. [Backend Configuration](#backend-configuration)
7. [Deployment](#deployment)
8. [Testing](#testing)

---

## Prerequisites

Before starting, ensure you have:
- **Node.js 16+** installed ([Download](https://nodejs.org))
- **Git** installed ([Download](https://git-scm.com))
- A **Google account** (free)
- Basic command line knowledge

---

## Groq API Setup

1. Go to [Groq Console](https://console.groq.com)
2. Sign up or log in (GitHub/Google account works)
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Copy the key (starts with `gsk_...`)
6. Store it safely — you'll need it for `.env`

**Free Tier:** Generous daily request limits, perfect for this project.

---

## Airtable Setup

### Step 1: Create Account
1. Go to [Airtable.com](https://airtable.com)
2. Sign up for free account

### Step 2: Create Base
1. Click **Add a base** → **Start from scratch**
2. Name it: **"Leads CRM"**

### Step 3: Configure Fields
Delete default fields and create these:

| Field Name | Field Type | Configuration |
|------------|-----------|---------------|
| `Name` | Single line text | — |
| `Email` | Email | — |
| `Company` | Single line text | — |
| `Message` | Long text | — |
| `Budget` | Single line text | — |
| `Priority` | Single select | Options: Hot, Warm, Cold |
| `Category` | Single line text | — |
| `AI Summary` | Long text | — |
| `Timestamp` | Date | Include time |
| `Processed At` | Date | Include time |

### Step 4: Get API Credentials
1. Click your profile icon → **Developer hub**
2. Go to **Personal access tokens**
3. Click **Create new token**
4. Name it: "Lead CRM Agent"
5. Add scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
6. Add access to your "Leads CRM" base
7. Create token and **copy it**

### Step 5: Get Base ID
1. Open your Airtable base
2. Look at the URL: `https://airtable.com/appXXXXXXXXX/tblYYYYYYYY`
3. Copy the `appXXXXXXXXX` part — this is your Base ID

---

## Slack Setup

### Step 1: Create Workspace (if needed)
1. Go to [Slack](https://slack.com)
2. Create a new workspace or use existing one

### Step 2: Create Incoming Webhook
1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click **Create New App** → **From scratch**
3. Name it: "Lead Alerts"
4. Select your workspace
5. Click **Incoming Webhooks** in the sidebar
6. Toggle **Activate Incoming Webhooks** to ON
7. Click **Add New Webhook to Workspace**
8. Select a channel (e.g., #leads or #general)
9. Click **Allow**
10. **Copy the webhook URL** (starts with `https://hooks.slack.com/...`)

---

## Google Forms Setup

### Step 1: Create Form
1. Go to [Google Forms](https://forms.google.com)
2. Click **Blank** to create new form
3. Title: "Lead Inquiry Form"

### Step 2: Add Questions
Add these fields:

1. **Name**
   - Type: Short answer
   - Required: Yes

2. **Email**
   - Type: Short answer
   - Enable: Response validation → Email
   - Required: Yes

3. **Company**
   - Type: Short answer
   - Required: No

4. **Message**
   - Type: Paragraph
   - Prompt: "How can we help you?"
   - Required: Yes

5. **Budget**
   - Type: Multiple choice
   - Options:
     - Under $5k
     - $5k-$10k
     - $10k-$50k
     - $50k+
     - Not sure
   - Required: No

### Step 3: Link to Sheet
1. Click **Responses** tab
2. Click green Sheets icon
3. Select **Create a new spreadsheet**
4. Name it: "Lead Responses"

### Step 4: Set Up Apps Script
1. Open the created Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Delete any existing code
4. Copy the entire contents from `scripts/google-apps-script.js`
5. Paste into the script editor
6. **Important:** Update the `WEBHOOK_URL` variable (line 18) with your backend URL
7. Save the project (Ctrl+S or Cmd+S)
8. Name it: "Lead Webhook Trigger"

### Step 5: Create Trigger
1. Click the **Triggers** icon (clock) in left sidebar
2. Click **+ Add Trigger**
3. Configure:
   - Choose function: `onFormSubmit`
   - Event source: `From spreadsheet`
   - Event type: `On form submit`
4. Click **Save**
5. You'll be asked to authorize — click **Review Permissions**
6. Select your Google account
7. Click **Advanced** → **Go to Lead Webhook Trigger (unsafe)**
8. Click **Allow**

---

## Backend Configuration

### Step 1: Clone and Install
```bash
git clone https://github.com/yourusername/lead-to-crm-agent.git
cd lead-to-crm-agent
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
GROQ_API_KEY=gsk_your_groq_key_here
AIRTABLE_TOKEN=patXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Leads
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/XXXXX
PORT=5000
NODE_ENV=development
```

### Step 3: Test Locally
```bash
npm start
```

You should see:
```
Server running on port 5000
Environment: development
```

Test the health endpoint:
```bash
curl http://localhost:5000/health
```

---

## Deployment

### Option 1: Render (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/lead-to-crm-agent.git
git push -u origin main
```

2. **Deploy on Render**
   - Go to [Render.com](https://render.com)
   - Sign up / Log in
   - Click **New +** → **Web Service**
   - Connect your GitHub repository
   - Configure:
     - **Name:** lead-crm-agent
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Instance Type:** Free

3. **Add Environment Variables**
   - Click **Environment** tab
   - Add each variable from your `.env` file
   - Click **Save Changes**

4. **Deploy**
   - Render will automatically deploy
   - Wait for deployment to complete
   - Copy your app URL (e.g., `https://lead-crm-agent.onrender.com`)

5. **Update Google Apps Script**
   - Go back to your Google Apps Script
   - Update `WEBHOOK_URL` with your Render URL:
   ```javascript
   const WEBHOOK_URL = 'https://lead-crm-agent.onrender.com/webhook/lead';
   ```
   - Save the script

---

## Testing

### Test 1: Health Check
```bash
curl https://your-app.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "uptime": 123.456,
  "timestamp": "2026-07-03T10:30:00.000Z"
}
```

### Test 2: Manual Test Endpoint
```bash
curl -X POST https://your-app.onrender.com/webhook/test \
  -H "Content-Type: application/json"
```

This should:
1. Process a test lead
2. Create an Airtable record
3. Send a Slack notification

### Test 3: Full Flow via Google Form
1. Open your Google Form
2. Fill out a test submission
3. Click Submit
4. Within seconds, check:
   - Google Sheet (new row added)
   - Airtable (new record created)
   - Slack (notification received)

---

## Troubleshooting

### Form submissions not triggering
- Check Apps Script triggers are set up correctly
- Check Apps Script logs: **View** → **Logs**
- Verify WEBHOOK_URL is correct

### Backend errors
- Check Render logs
- Verify all environment variables are set
- Test with `/webhook/test` endpoint first

### Airtable errors
- Verify Base ID is correct
- Check token has correct permissions
- Ensure field names match exactly (case-sensitive)

### Slack not receiving notifications
- Test webhook URL with curl
- Verify webhook is still active in Slack settings

---

## Next Steps

Once everything is working:
1. Customize the Google Form styling
2. Share the form link on your website
3. Set up Airtable views (by Priority, Category)
4. Explore building the optional dashboard

Need help? Check the main README or open an issue on GitHub.