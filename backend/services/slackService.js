const axios = require('axios');

/**
 * Send formatted notification to Slack
 */
async function sendSlackNotification(leadData, airtableRecord) {
  try {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('Slack webhook URL not configured, skipping notification');
      return { skipped: true };
    }

    const priorityEmoji = {
      'Hot': '🔥',
      'Warm': '⚡',
      'Cold': '❄️'
    };

    const emoji = priorityEmoji[leadData.priority] || '📋';

    const message = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${emoji} New Lead: ${leadData.name}`,
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Company:*\n${leadData.company || 'Not specified'}`
            },
            {
              type: 'mrkdwn',
              text: `*Email:*\n${leadData.email}`
            },
            {
              type: 'mrkdwn',
              text: `*Priority:*\n${emoji} ${leadData.priority}`
            },
            {
              type: 'mrkdwn',
              text: `*Category:*\n${leadData.category}`
            },
            {
              type: 'mrkdwn',
              text: `*Budget:*\n${leadData.budget}`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*AI Summary:*\n${leadData.summary}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Original Message:*\n_${leadData.message.substring(0, 200)}${leadData.message.length > 200 ? '...' : ''}_`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '📊 View in Airtable',
                emoji: true
              },
              url: airtableRecord.url,
              style: 'primary'
            }
          ]
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Received: ${new Date(leadData.timestamp).toLocaleString()}`
            }
          ]
        }
      ]
    };

    await axios.post(webhookUrl, message);
    console.log('Slack notification sent successfully');

    return { sent: true };

  } catch (error) {
    console.error('Error sending Slack notification:', error.message);
    // Don't throw - notification failure shouldn't break the pipeline
    return { sent: false, error: error.message };
  }
}

module.exports = {
  sendSlackNotification
};