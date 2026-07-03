 # Google Form Setup Guide

This guide will help you create a Google Form that automatically triggers your lead automation system.

---

## Part 1: Create the Google Form

### Step 1: Create a New Form
1. Go to [Google Forms](https://forms.google.com)
2. Click the **"+"** button or **"Blank"** to create a new form
3. Title your form: **"Lead Inquiry Form"** or **"Contact Us"**

### Step 2: Add Form Questions

Add these 5 fields to your form:

#### Question 1: Name
- **Question type:** Short answer
- **Question:** "Name" or "Your Name"
- **Required:** Yes (toggle on)

#### Question 2: Email
- **Question type:** Short answer
- **Question:** "Email" or "Your Email"
- **Required:** Yes (toggle on)
- Click the **⋮** (three dots) → **Response validation**
- Select: **Text** → **Email**
- This ensures valid email addresses

#### Question 3: Company
- **Question type:** Short answer
- **Question:** "Company" or "Company Name"
- **Required:** No (optional)

#### Question 4: Message
- **Question type:** Paragraph
- **Question:** "How can we help you?" or "Your Message"
- **Description (optional):** "Tell us about your inquiry, project, or question"
- **Required:** Yes (toggle on)

#### Question 5: Budget
- **Question type:** Multiple choice
- **Question:** "Budget Range" or "Estimated Budget"
- **Options:**
  - Under $5k
  - $5k-$10k
  - $10k-$50k
  - $50k+
  - Not sure yet
- **Required:** No (optional)

### Step 3: Customize Form Appearance (Optional)
1. Click the **palette icon** (Theme) at the top
2. Choose colors that match your brand
3. Add a header image if desired

---

## Part 2: Link Form to Google Sheet

### Step 1: Create Response Sheet
1. In your form, click the **"Responses"** tab at the top
2. Click the **Google Sheets icon** (green spreadsheet)
3. Select **"Create a new spreadsheet"**
4. Name it: **"Lead Responses"**
5. Click **"Create"**

### Step 2: Verify Sheet Structure
1. The sheet will open automatically
2. You should see columns:
   - Timestamp
   - Name
   - Email
   - Company
   - Message (or your question text)
   - Budget

---

## Part 3: Set Up Apps Script Webhook

### Step 1: Open Apps Script Editor
1. In your **Google Sheet** (Lead Responses)
2. Click **Extensions** → **Apps Script**
3. You'll see the Apps Script editor

### Step 2: Add the Webhook Code
1. Delete any existing code in the editor
2. Copy this entire script:

```javascript
// ===========================================
// Lead-to-CRM Webhook Script
// ===========================================

// IMPORTANT: Update this URL with your backend URL
// For local testing: http://localhost:5000/webhook/lead
// For production: https://your-app.onrender.com/webhook/lead
const WEBHOOK_URL = 'http://localhost:5000/webhook/lead';

/**
 * Trigger function that runs when a new form response is submitted
 */
function onFormSubmit(e) {
  try {
    console.log('Form submitted, processing...');
    
    // Get the form response values
    const values = e.namedValues;
    
    // Extract form data (adjust field names if your questions are different)
    const leadData = {
      name: getFieldValue(values, ['Name', 'Your Name']),
      email: getFieldValue(values, ['Email', 'Your Email', 'Email Address']),
      company: getFieldValue(values, ['Company', 'Company Name', 'Organization']),
      message: getFieldValue(values, ['How can we help you?', 'Message', 'Your Message', 'Inquiry']),
      budget: getFieldValue(values, ['Budget Range', 'Budget', 'Estimated Budget']),
      timestamp: new Date().toISOString()
    };
    
    console.log('Lead data:', JSON.stringify(leadData, null, 2));
    
    // Send to webhook
    const response = sendToWebhook(leadData);
    
    console.log('Webhook response:', response.getContentText());
    
  } catch (error) {
    console.error('Error in onFormSubmit:', error.toString());
    // Don't throw - we don't want form submissions to fail
  }
}

/**
 * Helper function to get field value from possible field names
 */
function getFieldValue(values, possibleNames) {
  for (const name of possibleNames) {
    if (values[name] && values[name][0]) {
      return values[name][0];
    }
  }
  return '';
}

/**
 * Send lead data to webhook endpoint
 */
function sendToWebhook(data) {
  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(data),
    'muteHttpExceptions': true
  };
  
  return UrlFetchApp.fetch(WEBHOOK_URL, options);
}

/**
 * Test function - run this to test without submitting the form
 */
function testWebhook() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    company: 'Test Company',
    message: 'This is a test message from Apps Script',
    budget: '$10k-$50k',
    timestamp: new Date().toISOString()
  };
  
  console.log('Sending test data:', testData);
  
  try {
    const response = sendToWebhook(testData);
    console.log('Response code:', response.getResponseCode());
    console.log('Response:', response.getContentText());
  } catch (error) {
    console.error('Error:', error.toString());
  }
}
```

3. **IMPORTANT:** Update line 8 with your webhook URL:
   - For local testing: `http://localhost:5000/webhook/lead`
   - After deploying: `https://your-app.onrender.com/webhook/lead`

4. Save the project:
   - Click the **disk icon** or press `Ctrl+S` (Cmd+S on Mac)
   - Name the project: **"Lead Webhook Trigger"**

---

## Part 4: Create the Trigger

### Step 1: Open Triggers Page
1. In Apps Script editor, click the **clock icon** (Triggers) in the left sidebar
2. Click **"+ Add Trigger"** button (bottom right)

### Step 2: Configure the Trigger
Set these values:

- **Choose which function to run:** `onFormSubmit`
- **Choose which deployment should run:** `Head`
- **Select event source:** `From spreadsheet`
- **Select event type:** `On form submit`

### Step 3: Save and Authorize
1. Click **"Save"**
2. You'll be asked to authorize the script:
   - Click **"Review Permissions"**
   - Select your Google account
   - Click **"Advanced"** → **"Go to Lead Webhook Trigger (unsafe)"**
   - Click **"Allow"**
3. The trigger is now active!

---

## Part 5: Testing

### Test 1: Manual Test Function
1. In Apps Script editor, select **`testWebhook`** from the function dropdown
2. Click **"Run"** (play button)
3. Check your:
   - Apps Script logs (View → Logs)
   - Terminal running npm start
   - Airtable for new record
   - Slack for notification

### Test 2: Live Form Submission
1. Go back to your Google Form
2. Click the **eye icon** (Preview) at the top
3. Fill out and submit the form
4. Check the same places above

Within seconds you should see:
- ✅ New row in Google Sheet
- ✅ AI-processed lead in Airtable
- ✅ Slack notification

---

## 🎯 Troubleshooting

### Forms not triggering webhook
- Check Apps Script **View → Logs** for errors
- Verify trigger is set up (clock icon)
- Check WEBHOOK_URL is correct

### 400/500 errors in logs
- Make sure your backend server is running
- Test the webhook directly with curl first
- Check server logs for errors

### Field names don't match
- Apps Script uses your exact question text as field names
- Update the `possibleNames` arrays in the script to match your questions
- Or rename your form questions to match the script

---

## 📋 What Happens Now

Every time someone submits your form:
1. 📝 Google Form captures the response
2. 📊 Google Sheet receives the data
3. ⚡ Apps Script trigger fires instantly
4. 🚀 Webhook sends data to your backend
5. 🤖 AI analyzes and enriches the lead
6. 💾 Lead saved to Airtable
7. 💬 Team notified via Slack

**All automatically. No manual work required.**

---

## 🌐 Next: Deployment

Once Google Forms is working locally, deploy to Render to make it accessible from anywhere on the internet!