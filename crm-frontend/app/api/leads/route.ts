import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Configure Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN,
}).base(process.env.AIRTABLE_BASE_ID!);

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  budget: string;
  priority: 'Hot' | 'Warm' | 'Cold';
  category: string;
  summary: string;
  timestamp: string;
  processedAt: string;
}

export async function GET() {
  try {
    const leads: Lead[] = [];
    
    // Fetch all records from Airtable
    const records = await base(process.env.AIRTABLE_TABLE_NAME!)
      .select({
        sort: [{ field: 'Timestamp', direction: 'desc' }],
      })
      .all();

    // Map Airtable records to Lead interface
    records.forEach((record) => {
      leads.push({
        id: record.id,
        name: record.get('Name') as string || '',
        email: record.get('Email') as string || '',
        company: record.get('Company') as string || '',
        message: record.get('Message') as string || '',
        budget: record.get('Budget') as string || '',
        priority: record.get('Priority') as 'Hot' | 'Warm' | 'Cold' || 'Warm',
        category: record.get('Category') as string || '',
        summary: record.get('AI Summary') as string || '',
        timestamp: record.get('Timestamp') as string || '',
        processedAt: record.get('Processed At') as string || '',
      });
    });

    return NextResponse.json({ 
      success: true, 
      leads,
      count: leads.length 
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch leads',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}