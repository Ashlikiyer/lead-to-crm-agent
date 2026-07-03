const axios = require('axios');

const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

/**
 * Save enriched lead data to Airtable
 */
async function saveToAirtable(leadData) {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Leads';
    const token = process.env.AIRTABLE_TOKEN;

    if (!token || !baseId) {
      throw new Error('Airtable credentials not configured');
    }

    const url = `${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(tableName)}`;

    const payload = {
      fields: {
        'Name': leadData.name,
        'Email': leadData.email,
        'Company': leadData.company,
        'Message': leadData.message,
        'Budget': leadData.budget,
        'Priority': leadData.priority,
        'Category': leadData.category,
        'AI Summary': leadData.summary,
        'Timestamp': leadData.timestamp,
        'Processed At': leadData.processedAt
      }
    };

    console.log('Sending to Airtable:', url);

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Airtable record created:', response.data.id);

    return {
      id: response.data.id,
      url: `https://airtable.com/${baseId}/${tableName}/${response.data.id}`
    };

  } catch (error) {
    console.error('Error saving to Airtable:', error.response?.data || error.message);
    throw new Error(`Airtable save failed: ${error.response?.data?.error?.message || error.message}`);
  }
}

/**
 * Get all leads from Airtable (for dashboard)
 */
async function getAllLeads(options = {}) {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Leads';
    const token = process.env.AIRTABLE_TOKEN;

    if (!token || !baseId) {
      throw new Error('Airtable credentials not configured');
    }

    const url = `${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(tableName)}`;
    
    const params = {
      sort: [{ field: 'Timestamp', direction: 'desc' }],
      ...options
    };

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params
    });

    return response.data.records.map(record => ({
      id: record.id,
      ...record.fields
    }));

  } catch (error) {
    console.error('Error fetching from Airtable:', error.response?.data || error.message);
    throw new Error(`Airtable fetch failed: ${error.message}`);
  }
}

module.exports = {
  saveToAirtable,
  getAllLeads
};