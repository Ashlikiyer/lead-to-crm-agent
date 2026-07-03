# Slack Webhook Setup Guide

Quick guide to create a Slack Incoming Webhook for lead notifications.

---

## Option 1: If You DON'T Have a Slack Workspace

### Step 1: Create a Slack Workspace
1. Go to [slack.com](https://slack.com)
2. Click **"Create a new workspace"**
3. Enter your email and follow the setup
4. Name your workspace (e.g., "My Workspace" or "Lead Alerts")
5. You can skip inviting team members for now

---

## Option 2: If You HAVE a Slack Workspace

Skip to "Creating the Incoming Webhook" below.

---

## Creating the Incoming Webhook

### Step 1: Go to Slack API
1. Open [api.slack.com/apps](https://api.slack.com/apps)
2. Click the green **"Create New App"** button

### Step 2: Choose Creation Method
1. Select **"From scratch"**
2. **App Name:** `Lead Alerts` (or any name you prefer)
3. **Pick a workspace:** Select your workspace from the dropdown
4. Click **"Create App"**

### Step 3: Enable Incoming Webhooks
1. You'll be on the app settings page
2. In the left sidebar, click **"Incoming Webhooks"**
3. Toggle the switch at the top to **"On"** (it should turn green)

### Step 4: Add Webhook to Workspace
1. Scroll down and click **"Add New Webhook to Workspace"**
2. **Select a channel** where notifications will appear:
   - Choose `#general` (easiest option)
   - Or create a new `#leads` channel first, then select it
3. Click **"Allow"**

### Step 5: Copy Your Webhook URL
1. After clicking Allow, you'll be back on the Incoming Webhooks page
2. Scroll down to **"Webhook URLs for Your Workspace"**
3. You'll see a webhook URL starting with `https://hooks.slack.com/services/...`
4. Click the **"Copy"** button next to it
5. This is your Slack Webhook URL!

---

## ✅ What You Should Have

Your webhook URL should:
- Start with `https://hooks.slack.com/services/`
- Be a long string with slashes and random characters
- Look like: `https://hooks.slack.com/services/T1234567890/B9876543210/abcdefghijklmnopqrstuvwx`

---

## 🎯 Next Step

Once you have your Slack Webhook URL, let me know and I'll help you add it to your `.env` file!

---

## 💡 Pro Tips

- **Test your webhook** - We'll test it when we run the backend
- **Change channel later** - You can add more webhooks for different channels
- **Notification format** - The lead notifications will have nice formatting with emojis
- **Non-blocking** - If Slack fails, leads still get saved to Airtable

---

## ❓ Troubleshooting

**Can't find "Create New App" button**
- Make sure you're logged into Slack
- Try opening api.slack.com/apps in a new tab

**Don't see "Incoming Webhooks" in sidebar**
- Refresh the page after creating the app
- Make sure you clicked on your app name

**Webhook URL doesn't work**
- Make sure you copied the entire URL
- Check that it starts with `https://hooks.slack.com/services/`