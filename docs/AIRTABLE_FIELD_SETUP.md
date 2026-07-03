# Airtable Field Setup Guide

Follow these steps to add each required field to your "Leads CRM" base.

## Fields You Should Have After Deleting

You should currently have just the **Name** field. Now we'll add 9 more fields.

---

## Field 1: Name ✅ (Already exists)
- **Type:** Single line text
- **Leave as is** - this is already created

---

## Field 2: Email

1. Click the **+** button next to your last column header
2. In the "Field type" dropdown, select **Email**
3. Name it: `Email`
4. Click **Create field**

---

## Field 3: Company

1. Click the **+** button to add another field
2. Keep it as **Single line text** (default)
3. Name it: `Company`
4. Click **Create field**

---

## Field 4: Message

1. Click the **+** button
2. Change type to **Long text**
   - Click the field type dropdown
   - Select "Long text"
3. Name it: `Message`
4. Click **Create field**

---

## Field 5: Budget

1. Click the **+** button
2. Keep as **Single line text**
3. Name it: `Budget`
4. Click **Create field**

---

## Field 6: Priority ⭐ (Important - Single Select)

1. Click the **+** button
2. Change type to **Single select**
   - Click the field type dropdown
   - Scroll down and select "Single select"
3. Name it: `Priority`
4. **Add three options:**
   - Type `Hot` and press Enter
   - Type `Warm` and press Enter
   - Type `Cold` and press Enter
5. **Optional:** Assign colors to each option for visual clarity
   - Hot = Red
   - Warm = Yellow/Orange
   - Cold = Blue
6. Click **Create field**

---

## Field 7: Category

1. Click the **+** button
2. Keep as **Single line text**
3. Name it: `Category`
4. Click **Create field**

---

## Field 8: AI Summary

1. Click the **+** button
2. Change type to **Long text**
3. Name it: `AI Summary`
4. Click **Create field**

---

## Field 9: Timestamp

1. Click the **+** button
2. Change type to **Date**
   - Click the field type dropdown
   - Select "Date"
3. Name it: `Timestamp`
4. **Important:** Enable "Include a time field"
   - There's a checkbox that says "Include a time field"
   - Make sure it's checked ✅
5. Click **Create field**

---

## Field 10: Processed At

1. Click the **+** button
2. Change type to **Date**
3. Name it: `Processed At`
4. **Important:** Enable "Include a time field" ✅
5. Click **Create field**

---

## ✅ Verification Checklist

After adding all fields, your table should have these 10 columns in order:

1. ✅ Name (Single line text)
2. ✅ Email (Email)
3. ✅ Company (Single line text)
4. ✅ Message (Long text)
5. ✅ Budget (Single line text)
6. ✅ Priority (Single select: Hot, Warm, Cold)
7. ✅ Category (Single line text)
8. ✅ AI Summary (Long text)
9. ✅ Timestamp (Date with time)
10. ✅ Processed At (Date with time)

---

## 🎯 Next Steps

Once all fields are created:
1. Let me know you're done
2. I'll guide you to get your **Personal Access Token**
3. Then get your **Base ID**
4. Finally, update your `.env` file

---

## 💡 Pro Tips

- **Field names must match exactly** - case sensitive!
- The order doesn't matter, but having all 10 fields is required
- You can rearrange columns later if needed
- Don't worry if you have empty rows - that's normal

---

## ❓ Having Issues?

Common problems:
- **Can't find "Long text"** → Look for "Long text" not "Paragraph"
- **Can't find "Single select"** → Scroll down in the field type list
- **Forgot to enable time** → Edit the Date field and check the time option
- **Typo in field name** → Click the field name to rename it