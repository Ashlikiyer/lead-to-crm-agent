const express = require('express');
const router = express.Router();
const { processLead } = require('../services/leadProcessor');

// Webhook endpoint to receive lead data from Google Apps Script
router.post('/lead', async (req, res) => {
  try {
    console.log('Received webhook payload:', JSON.stringify(req.body, null, 2));

    // Validate payload
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        error: 'Invalid payload',
        message: 'Request body is empty' 
      });
    }

    // Process the lead
    const result = await processLead(req.body);

    res.status(200).json({
      success: true,
      message: 'Lead processed successfully',
      data: result
    });

  } catch (error) {
    console.error('Error processing lead:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process lead',
      message: error.message
    });
  }
});

// Test endpoint for manual testing
router.post('/test', async (req, res) => {
  try {
    // Use default test data if body is empty or missing required fields
    const testPayload = (req.body && Object.keys(req.body).length > 0) ? req.body : {
      name: 'Test Lead',
      email: 'test@example.com',
      company: 'Test Company',
      message: 'This is a test inquiry about pricing for enterprise solutions.',
      budget: '$10k-$50k',
      timestamp: new Date().toISOString()
    };

    console.log('Processing test lead:', testPayload);
    const result = await processLead(testPayload);

    res.status(200).json({
      success: true,
      message: 'Test lead processed successfully',
      data: result
    });

  } catch (error) {
    console.error('Error processing test lead:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process test lead',
      message: error.message
    });
  }
});

module.exports = router;