const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Analyze lead data using Groq AI
 * Returns structured analysis with summary, priority, and category
 */
async function analyzeLeadWithAI(leadData) {
  try {
    const prompt = buildPrompt(leadData);
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert sales analyst. Analyze lead inquiries and provide structured insights.
          
Your task is to:
1. Summarize the inquiry concisely (1-2 sentences)
2. Assign a priority level (Hot, Warm, or Cold) based on urgency, budget signals, and intent
3. Categorize the inquiry type

Priority Guidelines:
- Hot: Clear buying intent, specific needs, urgent timeline, strong budget signals
- Warm: General interest, exploring options, moderate budget, flexible timeline
- Cold: Vague inquiry, information gathering, no budget mentioned, no urgency

Category Guidelines:
Choose the most relevant: Pricing Inquiry, Partnership, Demo Request, Support, General Inquiry, Product Question, Enterprise, Integration

Always respond with valid JSON in this exact format:
{
  "summary": "Brief 1-2 sentence summary",
  "priority": "Hot|Warm|Cold",
  "category": "Category name"
}`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('Empty response from Groq API');
    }

    const analysis = JSON.parse(response);
    
    // Validate response structure
    if (!analysis.summary || !analysis.priority || !analysis.category) {
      throw new Error('Invalid response structure from AI');
    }

    // Normalize priority value
    const validPriorities = ['Hot', 'Warm', 'Cold'];
    if (!validPriorities.includes(analysis.priority)) {
      console.warn(`Invalid priority: ${analysis.priority}, defaulting to Warm`);
      analysis.priority = 'Warm';
    }

    return analysis;

  } catch (error) {
    console.error('Error analyzing lead with AI:', error);
    
    // Fallback response if AI fails
    return {
      summary: `Lead inquiry from ${leadData.company || leadData.name}: ${leadData.message.substring(0, 100)}...`,
      priority: 'Warm',
      category: 'Unclassified'
    };
  }
}

/**
 * Build the prompt for AI analysis
 */
function buildPrompt(leadData) {
  return `Analyze this lead inquiry:

Name: ${leadData.name}
Company: ${leadData.company || 'Not specified'}
Email: ${leadData.email}
Budget: ${leadData.budget || 'Not specified'}
Message: ${leadData.message}

Provide a concise summary, priority assessment (Hot/Warm/Cold), and category.`;
}

module.exports = {
  analyzeLeadWithAI
};