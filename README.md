# Lead-to-CRM Automation Agent

An AI-powered workflow automation system that captures leads, enriches them with intelligent analysis, and manages them through a complete CRM pipeline — all in real-time with zero manual data entry.

**Portfolio Project by:** Ashley Kier Ferreol

## 🎯 Problem It Solves

Small businesses collect leads through forms but often struggle with:
- ✉️ Leads sitting unread in inboxes or spreadsheets
- 🤷 No automatic prioritization or summarization
- ⏱️ Slow follow-up because nobody "owns" the lead
- 📊 No clean, searchable record teams can act on

**This agent solves all of that automatically.**

## ⚡ How It Works

```
Form Submission → Webhook Trigger → AI Analysis → CRM Save → Slack Alert
```

1. **Lead fills form** (Google Forms) with their inquiry
2. **Instant trigger** via Google Apps Script webhook
3. **AI enrichment** using Groq (Llama 3.3 70B) to summarize and prioritize
4. **Structured save** to Airtable as a CRM record
5. **Team notification** via Slack with AI insights

All of this happens in seconds, with zero manual work.

## 🛠️ Tech Stack (100% Free)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Form Capture | Google Forms | Public lead capture |
| Trigger | Google Apps Script | Real-time webhook on form submit |
| Backend | Node.js + Express | Process workflow & orchestrate APIs |
| AI Model | Groq API (Llama 3.3 70B) | Smart lead analysis & prioritization |
| CRM/Database | Airtable | Structured lead storage |
| Notifications | Slack Webhooks | Instant team alerts |
| Hosting | Render | Free backend hosting |

> **Zero cost stack** — every tool has a permanent free tier.

## 📋 Features

### Core Features (Implemented)
- ✅ Automatic lead capture from Google Forms
- ✅ Real-time webhook trigger (no polling)
- ✅ AI-powered lead summarization
- ✅ Smart priority scoring (Hot/Warm/Cold)
- ✅ Auto-categorization (Pricing, Partnership, Demo, etc.)
- ✅ Structured CRM storage in Airtable
- ✅ Instant Slack notifications with AI insights
- ✅ Test endpoint for manual verification

### Coming Soon
- 🔜 Dashboard to view all leads
- 🔜 Auto-draft email replies
- 🔜 Lead deduplication
- 🔜 Weekly AI summary reports

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Accounts created for:
  - [Groq](https://console.groq.com) (get API key)
  - [Airtable](https://airtable.com) (create base + get token)
  - [Slack](https://api.slack.com/messaging/webhooks) (create incoming webhook)
  - Google account (for Forms & Apps Script)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/lead-to-crm-agent.git
cd lead-to-crm-agent
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```env
GROQ_API_KEY=your_groq_api_key
AIRTABLE_TOKEN=your_airtable_token
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=Leads
SLACK_WEBHOOK_URL=your_slack_webhook_url
PORT=5000
```

4. **Set up Airtable Base**

Create a base named "Leads CRM" with these fields:
- `Name` (Single line text)
- `Email` (Email)
- `Company` (Single line text)
- `Message` (Long text)
- `Budget` (Single line text)
- `Priority` (Single select: Hot, Warm, Cold)
- `Category` (Single line text)
- `AI Summary` (Long text)
- `Timestamp` (Date)
- `Processed At` (Date)

5. **Run the backend**
```bash
npm start
```

The server will start on `http://localhost:5000`

### Deploy to Render (Free)

1. Create account on [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Add all variables from `.env`
5. Deploy — you'll get a URL like `https://your-app.onrender.com`

### Set Up Google Form Trigger

1. Create a Google Form with fields:
   - Name
   - Email
   - Company
   - Message (paragraph)
   - Budget (dropdown: Under $5k, $5k-$10k, $10k-$50k, $50k+, Not sure)

2. Link responses to a Google Sheet (Form → Responses → Create Spreadsheet)

3. Open the Sheet → Extensions → Apps Script

4. Copy code from `scripts/google-apps-script.js`

5. Update `WEBHOOK_URL` with your Render URL:
```javascript
const WEBHOOK_URL = 'https://your-app.onrender.com/webhook/lead';
```

6. Save the script

7. Set up trigger:
   - Click Triggers (clock icon)
   - Add Trigger
   - Function: `onFormSubmit`
   - Event source: From spreadsheet
   - Event type: On form submit
   - Save & authorize

## 🧪 Testing

### Test via API endpoint
```bash
curl -X POST http://localhost:5000/webhook/test \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com", 
    "company": "Acme Corp",
    "message": "We need enterprise pricing for 100+ users ASAP",
    "budget": "$50k+"
  }'
```

### Test via Google Form
1. Submit a test lead through your Google Form
2. Check server logs for processing
3. Verify record appears in Airtable
4. Check Slack for notification

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/health` | GET | Server status |
| `/webhook/lead` | POST | Main webhook for form submissions |
| `/webhook/test` | POST | Test endpoint with sample data |

## 🏗️ Project Structure

```
lead-to-crm-agent/
├── backend/
│   ├── server.js              # Express server setup
│   ├── routes/
│   │   └── webhook.js         # Webhook endpoints
│   └── services/
│       ├── leadProcessor.js   # Main processing pipeline
│       ├── groqService.js     # AI analysis integration
│       ├── airtableService.js # CRM operations
│       └── slackService.js    # Notifications
├── scripts/
│   └── google-apps-script.js  # Form trigger code
├── .env.example               # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Groq API key for AI analysis | Yes |
| `AIRTABLE_TOKEN` | Airtable personal access token | Yes |
| `AIRTABLE_BASE_ID` | Your Airtable base ID | Yes |
| `AIRTABLE_TABLE_NAME` | Table name (default: "Leads") | No |
| `SLACK_WEBHOOK_URL` | Slack incoming webhook URL | Yes |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |

## 🎓 What I Learned

This project demonstrates:
- ✅ Building end-to-end AI automation workflows
- ✅ Integrating multiple third-party APIs
- ✅ Real-time event-driven architecture
- ✅ Structured AI prompting for reliable outputs
- ✅ Production-ready error handling
- ✅ Zero-cost deployment strategies

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome! Open an issue or PR.

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**Ashley Kier Ferreol**
- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn]
- Email: [Your Email]

---

Built as a demonstration project for AI Agent Builder positions, showcasing the ability to connect AI tools with APIs, databases, and internal systems to automate real business workflows.