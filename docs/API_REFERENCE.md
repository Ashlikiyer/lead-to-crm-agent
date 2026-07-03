# API Reference

Complete API documentation for the Lead-to-CRM Automation Agent.

## Base URL

**Local:** `http://localhost:5000`  
**Production:** `https://your-app.onrender.com`

---

## Endpoints

### Health Check

#### `GET /`

Basic health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Lead-to-CRM Automation Agent is running",
  "timestamp": "2026-07-03T10:30:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Service is running

---

#### `GET /health`

Detailed health status with uptime.

**Response:**
```json
{
  "status": "healthy",
  "uptime": 12345.67,
  "timestamp": "2026-07-03T10:30:00.000Z"
}
```

**Fields:**
- `status` - Health status (always "healthy" if responding)
- `uptime` - Server uptime in seconds
- `timestamp` - Current server timestamp (ISO 8601)

**Status Codes:**
- `200 OK` - Service is healthy

---

### Webhook Endpoints

#### `POST /webhook/lead`

Main webhook endpoint for receiving lead data from Google Apps Script.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "message": "I'm interested in your enterprise solution for 50+ users",
  "budget": "$10k-$50k",
  "timestamp": "2026-07-03T10:30:00.000Z"
}
```

**Required Fields:**
- `email` (string) - Valid email address
- `message` (string) - Non-empty inquiry message

**Optional Fields:**
- `name` (string) - Defaults to "Unknown" if not provided
- `company` (string) - Defaults to empty string
- `budget` (string) - Defaults to "Not specified"
- `timestamp` (string) - Defaults to current time if not provided

**Success Response:**
```json
{
  "success": true,
  "message": "Lead processed successfully",
  "data": {
    "leadId": "recABCDEF123456",
    "priority": "Hot",
    "category": "Pricing Inquiry",
    "summary": "Company seeking enterprise solution for 50+ users with strong budget signals."
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to process lead",
  "message": "Email is required"
}
```

**Status Codes:**
- `200 OK` - Lead processed successfully
- `400 Bad Request` - Invalid or missing required fields
- `500 Internal Server Error` - Processing error

**Processing Flow:**
1. Validates incoming data
2. Calls Groq AI for analysis (summary, priority, category)
3. Saves enriched data to Airtable
4. Sends Slack notification
5. Returns result

---

#### `POST /webhook/test`

Test endpoint that processes a sample lead or custom test data.

**Headers:**
```
Content-Type: application/json
```

**Request Body (Optional):**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "company": "Test Inc",
  "message": "This is a test inquiry",
  "budget": "$5k-$10k"
}
```

If no body is provided, uses default test data:
```json
{
  "name": "Test Lead",
  "email": "test@example.com",
  "company": "Test Company",
  "message": "This is a test inquiry about pricing for enterprise solutions.",
  "budget": "$10k-$50k",
  "timestamp": "2026-07-03T10:30:00.000Z"
}
```

**Response:**
Same as `/webhook/lead` endpoint

**Status Codes:**
- `200 OK` - Test lead processed
- `500 Internal Server Error` - Processing error

**Use Cases:**
- Testing the full pipeline without submitting a form
- Verifying Airtable and Slack integrations
- Development and debugging

---

## Data Models

### Lead Input

```typescript
{
  name?: string;        // Lead's full name
  email: string;        // Required - valid email
  company?: string;     // Company name
  message: string;      // Required - inquiry message
  budget?: string;      // Budget range
  timestamp?: string;   // ISO 8601 datetime
}
```

### AI Analysis Output

```typescript
{
  summary: string;      // 1-2 sentence summary
  priority: "Hot" | "Warm" | "Cold";
  category: string;     // e.g., "Pricing Inquiry", "Demo Request"
}
```

### Priority Definitions

- **Hot** - Clear buying intent, specific needs, urgent timeline, strong budget
- **Warm** - General interest, exploring options, moderate budget
- **Cold** - Vague inquiry, information gathering, no urgency

### Category Examples

Common categories returned by AI:
- Pricing Inquiry
- Demo Request
- Partnership
- Support
- General Inquiry
- Product Question
- Enterprise
- Integration
- Unclassified (fallback)

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error category",
  "message": "Detailed error message"
}
```

### Common Error Scenarios

**Missing Required Field:**
```json
{
  "success": false,
  "error": "Failed to process lead",
  "message": "Email is required"
}
```

**Empty Payload:**
```json
{
  "success": false,
  "error": "Invalid payload",
  "message": "Request body is empty"
}
```

**AI Service Failure:**
The system includes fallback handling. If Groq API fails, defaults are used:
- Priority: "Warm"
- Category: "Unclassified"
- Summary: Truncated original message

**Airtable Failure:**
```json
{
  "success": false,
  "error": "Failed to process lead",
  "message": "Airtable save failed: Invalid token"
}
```

**Slack Failure:**
Slack notifications are non-blocking. If Slack fails:
- Error is logged
- Lead is still saved to Airtable
- Processing continues normally

---

## Rate Limits

### Groq API
- Free tier: Check current limits at [Groq Console](https://console.groq.com)
- Typically: Generous daily request quota
- Fallback behavior if quota exceeded

### Airtable API
- Free tier: 5 requests per second per base
- 1,000 records per base
- Project handles rate limiting gracefully

### Slack Webhooks
- 1 message per second recommended
- No hard limit for incoming webhooks

---

## Authentication

Currently, the webhook endpoints are **public** (no authentication required).

**Security Considerations:**
- Endpoints are designed to be called by Google Apps Script
- Consider adding a secret token in production
- Deploy behind a firewall or add IP allowlisting if needed

**Example with Secret Token (Future Enhancement):**
```javascript
// In Google Apps Script
const options = {
  method: 'post',
  contentType: 'application/json',
  payload: JSON.stringify(payload),
  headers: {
    'X-Webhook-Secret': 'your-secret-token'
  }
};
```

---

## Examples

### cURL Examples

**Health Check:**
```bash
curl https://your-app.onrender.com/health
```

**Test Lead:**
```bash
curl -X POST https://your-app.onrender.com/webhook/test \
  -H "Content-Type: application/json"
```

**Custom Test Data:**
```bash
curl -X POST https://your-app.onrender.com/webhook/test \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@company.com",
    "company": "Big Corp",
    "message": "Need pricing for 100+ users ASAP",
    "budget": "$50k+"
  }'
```

### JavaScript Examples

**From Google Apps Script:**
```javascript
function sendToWebhook(leadData) {
  const url = 'https://your-app.onrender.com/webhook/lead';
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(leadData),
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}
```

**From Node.js:**
```javascript
const axios = require('axios');

async function sendLead(leadData) {
  const response = await axios.post(
    'https://your-app.onrender.com/webhook/lead',
    leadData
  );
  return response.data;
}
```

**From Browser (Fetch API):**
```javascript
async function submitLead(leadData) {
  const response = await fetch('https://your-app.onrender.com/webhook/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData)
  });
  return await response.json();
}
```

---

## Webhook Payload from Google Forms

When a form is submitted, Google Apps Script sends this structure:

```json
{
  "name": "Value from 'Name' field",
  "email": "Value from 'Email' field",
  "company": "Value from 'Company' field",
  "message": "Value from 'Message' field",
  "budget": "Value from 'Budget' field",
  "timestamp": "2026-07-03T10:30:00.000Z"
}
```

The Apps Script normalizes field names to lowercase for consistency.

---

## Support

For issues or questions:
- Open an issue on GitHub
- Check logs on Render dashboard
- Review Google Apps Script execution logs