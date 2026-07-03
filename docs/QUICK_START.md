# Quick Start Guide

Get the Lead-to-CRM Automation Agent running in 10 minutes.

## Prerequisites
- Node.js 16+ installed
- Git installed

## Step 1: Clone & Install (2 minutes)

```bash
git clone https://github.com/yourusername/lead-to-crm-agent.git
cd lead-to-crm-agent
npm install
```

## Step 2: Get API Keys (5 minutes)

You need free accounts and API keys from:

1. **Groq** → [console.groq.com](https://console.groq.com)
   - Sign up → API Keys → Create → Copy key

2. **Airtable** → [airtable.com](https://airtable.com)
   - Sign up → Create base "Leads CRM"
   - Profile → Developer hub → Create token
   - Copy Base ID from URL

3. **Slack** → [api.slack.com/apps](https://api.slack.com/apps)
   - Create App → Incoming Webhooks → Activate
   - Add to channel → Copy webhook URL

## Step 3: Configure Environment (1 minute)

```bash
cp .env.example .env
```

Edit `.env`:
```env
GROQ_API_KEY=gsk_your_key_here
AIRTABLE_TOKEN=pat_your_token_here
AIRTABLE_BASE_ID=app_your_base_id
AIRTABLE_TABLE_NAME=Leads
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
PORT=5000
```

## Step 4: Set Up Airtable Fields

In your Airtable base, create these fields:
- Name (Single line text)
- Email (Email)
- Company (Single line text)
- Message (Long text)
- Budget (Single line text)
- Priority (Single select: Hot, Warm, Cold)
- Category (Single line text)
- AI Summary (Long text)
- Timestamp (Date with time)
- Processed At (Date with time)

## Step 5: Run the Server (1 minute)

```bash
npm start
```

You should see:
```
Server running on port 5000
Environment: development
```

## Step 6: Test It

Open a new terminal and run:
```bash
curl -X POST http://localhost:5000/webhook/test
```

Check:
- ✅ Terminal shows processing logs
- ✅ New record appears in Airtable
- ✅ Slack notification received

## What's Next?

1. **Deploy to Render** (free) - See [SETUP_GUIDE.md](SETUP_GUIDE.md#deployment)
2. **Create Google Form** - See [SETUP_GUIDE.md](SETUP_GUIDE.md#google-forms-setup)
3. **Connect form trigger** - Link form to your deployed backend

## Troubleshooting

**"GROQ_API_KEY environment variable is missing"**
- Make sure you created the `.env` file
- Verify the key starts with `gsk_`

**"Airtable save failed"**
- Check Base ID is correct (from URL)
- Verify token has read/write permissions
- Ensure field names match exactly

**"Slack notification skipped"**
- Verify webhook URL starts with `https://hooks.slack.com/`
- Check webhook is still active in Slack

## Full Documentation

- [Complete Setup Guide](SETUP_GUIDE.md) - Detailed step-by-step
- [API Reference](API_REFERENCE.md) - All endpoints and examples
- [README](../README.md) - Project overview

## Support

Having issues? Open an issue on GitHub with:
- Error message
- What step you're on
- Your environment (OS, Node version)