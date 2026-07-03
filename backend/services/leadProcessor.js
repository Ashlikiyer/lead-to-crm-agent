const { analyzeLeadWithAI } = require('./groqService');
const { saveToAirtable } = require('./airtableService');
const { sendSlackNotification } = require('./slackService');

/**
 * Main lead processing pipeline
 * 1. Receives raw lead data from webhook
 * 2. Enriches with AI analysis (summary, priority, category)
 * 3. Saves to Airtable
 * 4. Sends Slack notification
 */
async function processLead(leadData) {
  try {
    console.log('Starting lead processing pipeline...');

    // Step 1: Validate lead data
    const validatedLead = validateLeadData(leadData);
    
    // Step 2: Analyze with AI
    console.log('Analyzing lead with AI...');
    const aiAnalysis = await analyzeLeadWithAI(validatedLead);
    
    // Step 3: Combine original data with AI insights
    const enrichedLead = {
      ...validatedLead,
      summary: aiAnalysis.summary,
      priority: aiAnalysis.priority,
      category: aiAnalysis.category,
      processedAt: new Date().toISOString()
    };

    console.log('Enriched lead:', enrichedLead);

    // Step 4: Save to Airtable
    console.log('Saving to Airtable...');
    const airtableRecord = await saveToAirtable(enrichedLead);
    
    // Step 5: Send Slack notification
    console.log('Sending Slack notification...');
    await sendSlackNotification(enrichedLead, airtableRecord);

    console.log('Lead processing completed successfully');

    return {
      leadId: airtableRecord.id,
      priority: enrichedLead.priority,
      category: enrichedLead.category,
      summary: enrichedLead.summary
    };

  } catch (error) {
    console.error('Error in lead processing pipeline:', error);
    throw new Error(`Lead processing failed: ${error.message}`);
  }
}

/**
 * Validate and normalize lead data
 */
function validateLeadData(data) {
  const normalized = {
    name: data.name || data.Name || 'Unknown',
    email: data.email || data.Email || '',
    company: data.company || data.Company || '',
    message: data.message || data.Message || data.inquiry || '',
    budget: data.budget || data.Budget || 'Not specified',
    timestamp: data.timestamp || data.Timestamp || new Date().toISOString()
  };

  // Basic validation
  if (!normalized.email) {
    throw new Error('Email is required');
  }

  if (!normalized.message || normalized.message.trim().length === 0) {
    throw new Error('Message/inquiry is required');
  }

  return normalized;
}

module.exports = {
  processLead
};