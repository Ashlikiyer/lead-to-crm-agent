/**
 * Google Apps Script - Form Submission Trigger
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet (linked to the Form)
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code
 * 4. Paste this entire script
 * 5. Update the WEBHOOK_URL variable below with your backend URL
 * 6. Save the script (Ctrl+S or Cmd+S)
 * 7. Go to Triggers (clock icon on left sidebar)
 * 8. Click "+ Add Trigger"
 * 9. Configure:
 *    - Function: onFormSubmit
 *    - Event source: From spreadsheet
 *    - Event type: On form submit
 * 10. Save and authorize the script
 */

// ⚠️ REPLACE THIS WITH YOUR ACTUAL BACKEND URL
const WEBHOOK_URL = 'https://your-backend-url.onrender.com/webhook/lead';

/**
 * This function triggers automatically when a form is submitted
 */
function onFormSubmit(e) {
  try {
    Logger.log('Form submitted, processing...');
    
    // Get the form response
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    
    // Extract form data
    const formData = {};
    itemResponses.forEach(function(itemResponse) {
      const question = itemResponse.getItem().getTitle();
      const answer = itemResponse.getResponse();
      formData[question] = answer;
    });
    
    // Add timestamp
    formData.timestamp = new Date().toISOString();
    
    Logger.log('Form data extracted: ' + JSON.stringify(formData));
    
    // Prepare payload with normalized field names
    const payload = {
      name: formData['Name'] || formData['Full Name'] || '',
      email: formData['Email'] || formData['Email Address'] || '',
      company: formData['Company'] || formData['Company Name'] || '',
      message: formData['Message'] || formData['Inquiry'] || formData['How can we help?'] || '',
      budget: formData['Budget'] || formData['Budget Range'] || 'Not specified',
      timestamp: formData.timestamp
    };
    
    Logger.log('Sending to webhook: ' + JSON.stringify(payload));
    
    // Send to backend webhook
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log('Webhook response code: ' + responseCode);
    Logger.log('Webhook response: ' + responseText);
    
    if (responseCode === 200) {
      Logger.log('✓ Lead sent successfully to backend');
    } else {
      Logger.log('✗ Failed to send lead. Status: ' + responseCode);
    }
    
  } catch (error) {
    Logger.log('ERROR in onFormSubmit: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
  }
}

/**
 * Manual test function - use this to test without submitting the form
 * 1. Update the test data below
 * 2. Click Run > testWebhook
 * 3. Check the logs (View > Logs)
 */
function testWebhook() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    company: 'Test Company Inc.',
    message: 'I am interested in your enterprise pricing and would like to schedule a demo next week.',
    budget: '$10k-$50k',
    timestamp: new Date().toISOString()
  };
  
  Logger.log('Testing webhook with data: ' + JSON.stringify(testData));
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(testData),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    Logger.log('Response code: ' + response.getResponseCode());
    Logger.log('Response: ' + response.getContentText());
  } catch (error) {
    Logger.log('Error: ' + error.toString());
  }
}