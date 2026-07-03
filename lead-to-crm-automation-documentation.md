# Lead-to-CRM Automation Agent
### Full Project Documentation & Phase Plan

**Author:** Ashley Kier Ferreol
**Purpose:** Portfolio project demonstrating AI-powered workflow automation (built for Junior AI Agent Builder applications)
**Cost:** $0 — every tool used has a permanent free tier

---

## 1. Problem Statement

Most small businesses and teams collect leads through forms (contact forms, event sign-ups, demo requests) but:
- Leads sit unread in an inbox or spreadsheet
- No one summarizes or prioritizes them
- Follow-up is slow because nobody "owns" the lead in real time
- There's no clean, searchable record teams can act on

**Goal:** Build an agent that automatically captures a new lead, understands it using AI, organizes it into a CRM, and notifies the team instantly — with no manual data entry.

This mirrors exactly the kind of "connect AI tools with APIs, databases, internal systems" and "automate real business processes" work described in AI Agent Builder roles.

---

## 2. Project Overview

**Flow in one sentence:**
Form submission → webhook triggers backend → AI reads & summarizes the lead → structured data saved to CRM → team gets a Slack alert with the summary.

### Core Features (MVP)
1. Public lead capture form
2. Automatic trigger on new submission (no polling/manual refresh)
3. AI-generated lead summary + priority score (Hot / Warm / Cold)
4. Auto-categorization (e.g., inquiry type, budget signal, urgency)
5. Structured record pushed to a free CRM/database
6. Real-time Slack notification with the AI summary
7. Simple internal dashboard to view all processed leads

### Stretch Features (Phase 5+)
- Auto-draft a reply email to the lead
- Lead scoring trends over time (dashboard chart)
- Multi-form support (different lead sources tagged separately)

---

## 3. Tech Stack (100% Free Tier)

| Layer | Tool | Why | Free Tier Limit |
|---|---|---|---|
| Form / Lead Capture | **Google Forms** | Zero setup, instant public form, built-in Google Sheets sync | Fully free, unlimited |
| Trigger | **Google Apps Script** (bound to the Sheet) | Fires a webhook the moment a new row/response is added — no polling needed | Free, generous daily quota |
| Backend | **Node.js + Express** | You already know this stack; handles the webhook, AI call, and CRM push | Free (self-hosted / free hosting) |
| Hosting (backend) | **Render** (free web service) | Matches your existing PathFinder deployment experience | Free tier sleeps after inactivity — acceptable for a demo project |
| AI Model | **Groq API** (Llama 3.1/3.3 70B) | Extremely fast + generous free tier, you already have Groq experience | Free tier requests/day (check current Groq console limits) |
| CRM / Database | **Airtable** (free plan) | Acts as a lightweight CRM — views, filters, tags, no SQL needed | Free plan: 1,000 records/base |
| Notifications | **Slack Incoming Webhooks** | Instant team alert, no Slack app approval needed | Free |
| Dashboard (optional) | **Next.js + TailwindCSS**, reading from Airtable API | Matches your existing frontend stack | Free (Vercel hosting) |
| Version Control | **GitHub** | Public repo for portfolio visibility | Free |

> No paid tool is required anywhere in this stack. Every service listed has a permanent (not trial) free tier.

---

## 4. System Architecture

```
[Google Form]
     │  (user submits lead info)
     ▼
[Google Sheet] ──(onFormSubmit trigger)──▶ [Google Apps Script]
                                                   │
                                                   │  POST webhook (lead data as JSON)
                                                   ▼
                                     [Node.js/Express Backend on Render]
                                                   │
                                     ┌─────────────┼─────────────┐
                                     ▼             ▼             ▼
                              [Groq API]   [Airtable API]  [Slack Webhook]
                              (summarize,   (save lead as     (notify team
                               score,       structured        with AI
                               categorize)  CRM record)        summary)
                                                   │
                                                   ▼
                                     [Optional Dashboard - Next.js]
                                     (reads Airtable, displays leads)
```

### Data Flow (step-by-step)
1. Lead fills out Google Form (Name, Email, Company, Message/Inquiry, Budget range).
2. Google Sheet auto-receives the response as a new row.
3. Apps Script `onFormSubmit` trigger fires → sends the row data as JSON to your Express webhook endpoint.
4. Express backend receives the payload and calls Groq API with a structured prompt:
   - Summarize the inquiry in 1–2 sentences
   - Classify priority: Hot / Warm / Cold
   - Extract category (e.g., "Pricing inquiry," "Partnership," "Support")
5. Backend writes the enriched lead (original fields + AI summary + priority + category) to Airtable via its REST API.
6. Backend posts a formatted message to Slack via Incoming Webhook — team sees the lead and the AI summary within seconds.
7. (Optional) Dashboard fetches all Airtable records and displays them in a filterable table/board.

---

## 5. Phase Plan

### **Phase 0 — Setup & Environment (Day 1, ~2 hrs)**
- [ ] Create GitHub repo (`lead-to-crm-agent`)
- [ ] Create Groq API account + get API key
- [ ] Create Airtable account + base with fields: Name, Email, Company, Message, Priority, Category, AI Summary, Timestamp
- [ ] Create a Slack workspace (or use an existing one) + generate an Incoming Webhook URL
- [ ] Scaffold Express backend project, set up `.env` for all API keys
- [ ] Push initial commit

**Deliverable:** Empty but connected project skeleton; all accounts/keys ready.

---

### **Phase 1 — Lead Capture & Trigger (Day 1–2, ~3 hrs)**
- [ ] Build Google Form with the lead fields
- [ ] Link Form responses to a Google Sheet
- [ ] Write Apps Script `onFormSubmit(e)` function that packages the row into JSON
- [ ] Deploy Apps Script as a trigger, test it sends a POST request (use a temporary endpoint like webhook.site to confirm payload shape first)

**Deliverable:** Submitting the form successfully fires a webhook with correct data.

---

### **Phase 2 — AI Processing Layer (Day 2–3, ~4 hrs)**
- [ ] Build Express endpoint `/webhook/lead` to receive the payload
- [ ] Design the Groq prompt (system prompt + structured JSON output) to return:
  ```json
  { "summary": "...", "priority": "Hot|Warm|Cold", "category": "..." }
  ```
- [ ] Add error handling (AI call fails → fallback to "Unclassified" instead of dropping the lead)
- [ ] Test with 5–10 sample lead messages of varying intent/urgency

**Deliverable:** Any lead payload sent to the endpoint returns a clean AI-generated summary + priority + category.

---

### **Phase 3 — CRM Integration (Day 3, ~2–3 hrs)**
- [ ] Connect Airtable REST API (using a Personal Access Token, free)
- [ ] On receiving AI output, write a new record combining original lead data + AI enrichment
- [ ] Verify records appear correctly in Airtable, including correct field types (Priority as single-select, etc.)

**Deliverable:** End-to-end: Form → Sheet → Webhook → AI → Airtable record, fully automatic.

---

### **Phase 4 — Notifications (Day 4, ~2 hrs)**
- [ ] Format a clean Slack message (lead name, company, AI summary, priority badge, link to Airtable record)
- [ ] Send via Incoming Webhook right after the Airtable write succeeds
- [ ] Add priority-based formatting (e.g., 🔥 for Hot leads) for scannability

**Deliverable:** Every new lead produces an instant, readable Slack alert.

---

### **Phase 5 — Dashboard (Optional, Day 5–6, ~4–6 hrs)**
- [ ] Build a simple Next.js page that fetches Airtable records via API
- [ ] Display as a table or Kanban-style board (grouped by Priority)
- [ ] Add basic filtering (by category, date, priority)
- [ ] Deploy to Vercel

**Deliverable:** A shareable, live link showing processed leads — great for demos and interviews.

---

### **Phase 6 — Polish, Testing & Documentation (Day 6–7, ~3 hrs)**
- [ ] Write a clean `README.md` (architecture diagram, setup instructions, demo GIF/screenshots)
- [ ] Record a 1–2 min Loom/demo video showing the full flow live
- [ ] Add error/edge case handling (empty message field, spam-like submissions, duplicate leads)
- [ ] Final cleanup: environment variable documentation, `.env.example` file
- [ ] Push final version, tag a release on GitHub

**Deliverable:** Portfolio-ready project with documentation, demo video, and public repo link.

---

## 6. Estimated Timeline

| Phase | Effort | Can Run In Parallel With |
|---|---|---|
| Phase 0 | ~2 hrs | — |
| Phase 1 | ~3 hrs | — |
| Phase 2 | ~4 hrs | — |
| Phase 3 | ~2–3 hrs | — |
| Phase 4 | ~2 hrs | Phase 5 (dashboard) |
| Phase 5 | ~4–6 hrs | Phase 4 |
| Phase 6 | ~3 hrs | — |
| **Total** | **~20–23 hrs** | Achievable over one focused weekend |

---

## 7. Environment Variables Reference

```
GROQ_API_KEY=your_groq_key
AIRTABLE_TOKEN=your_airtable_personal_access_token
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=Leads
SLACK_WEBHOOK_URL=your_slack_incoming_webhook_url
PORT=5000
```

---

## 8. Why This Project Is Interview-Relevant

| Job Requirement | How This Project Proves It |
|---|---|
| Build and deploy AI agents and automation workflows | Full end-to-end automation, deployed live |
| Connect AI tools with APIs, databases, internal systems | Groq + Airtable + Slack + Google Sheets integration |
| Prototype AI-powered workflows for ops/marketing | Lead management is a real ops workflow |
| Comfortable working with APIs and integrations | 4 different third-party APIs wired together |
| Document workflows and share best practices | This documentation itself is proof of that skill |
| Proactive mindset, ship quickly | Built in a weekend, MVP-first approach |

---

## 9. Future Enhancements (Post-MVP)
- Auto-generate a suggested email reply per lead using Groq
- Add lead deduplication logic (match by email)
- Weekly AI-generated summary report of all leads (sent via Slack or email)
- Swap Google Forms for a custom-branded Next.js form for a more polished demo
