# Getting Airtable API Credentials

Now that your fields are set up, let's get your API credentials.

---

## Part 1: Get Your Personal Access Token

### Step 1: Access Developer Hub
1. In Airtable, click your **profile picture** (top right corner)
2. Select **"Developer hub"** from the dropdown menu

### Step 2: Create Personal Access Token
1. In the Developer hub, click **"Personal access tokens"** in the left sidebar
2. Click the **"Create new token"** button (top right)

### Step 3: Configure Token
1. **Name your token:** `Lead CRM Agent`
2. **Add Scopes** - Click "Add a scope" and select these three:
   - ✅ `data.records:read`
   - ✅ `data.records:write`
   - ✅ `schema.bases:read`

### Step 4: Add Base Access
1. Scroll down to **"Access"** section
2. Click **"Add a base"**
3. Select your **"Leads CRM"** base from the list
4. Make sure it's checked ✅

### Step 5: Create and Copy Token
1. Click **"Create token"** button at the bottom
2. **IMPORTANT:** Copy the token immediately!
   - It starts with `pat...`
   - Example: `patABC123xyz456DEF789`
   - You won't be able to see it again!
3. Save it somewhere safe temporarily (we'll add it to .env next)

---

## Part 2: Get Your Base ID

### Method 1: From URL (Easiest)
1. Open your **"Leads CRM"** base in Airtable
2. Look at the URL in your browser address bar
3. The URL looks like: `https://airtable.com/appXXXXXXXXXXXXX/tblYYYYYYYYYYYY`
4. **Copy the part that starts with `app`**
   - Example: `appABC123XYZ456`
   - This is your Base ID!

### Method 2: From Base Info (Alternative)
1. In your base, click the **"Help"** button (? icon, top right)
2. Select **"API documentation"**
3. Your Base ID will be shown at the top
4. Copy it (starts with `app`)

---

## ✅ Verification

You should now have:
1. **Personal Access Token** - starts with `pat...` (long string)
2. **Base ID** - starts with `app...` (shorter string)

Example format:
```
Token: patABC123xyz456DEF789ghi012JKL345mno678PQR901
Base ID: appABC123XYZ456
```

---

## 🎯 Ready to Update .env

Once you have both credentials, let me know and I'll help you update your `.env` file!