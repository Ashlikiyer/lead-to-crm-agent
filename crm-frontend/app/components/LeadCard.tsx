'use client';

import { useState } from 'react';
import { Lead } from '../api/leads/route';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Building2, Clock, Sparkles } from 'lucide-react';
import LeadDetailsDialog from './LeadDetailsDialog';

interface LeadCardProps {
  lead: Lead;
}

export default function LeadCard({ lead }: LeadCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const priorityStyles = {
    Hot: 'bg-red-500 hover:bg-red-600',
    Warm: 'bg-orange-500 hover:bg-orange-600',
    Cold: 'bg-blue-500 hover:bg-blue-600',
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 bg-white border-gray-200 h-full flex flex-col">
      <CardHeader className="space-y-3 pb-3">
        {/* Header: Name, Company, Priority */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
              {lead.name}
            </h3>
            {lead.company && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span className="truncate">{lead.company}</span>
              </div>
            )}
          </div>
          <Badge className={`${priorityStyles[lead.priority]} text-white px-3 py-1 font-medium`}>
            {lead.priority}
          </Badge>
        </div>

        {/* AI Summary */}
        {lead.summary && (
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                AI Summary
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lead.summary}
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Meta Info: Category & Budget */}
        <div className="flex flex-wrap gap-2">
          {lead.category && (
            <Badge variant="secondary" className="text-xs font-normal">
              {lead.category}
            </Badge>
          )}
          {lead.budget && (
            <Badge variant="outline" className="text-xs font-normal">
              Budget: {lead.budget}
            </Badge>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <a
            href={`mailto:${lead.email}`}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span className="truncate">{lead.email}</span>
          </a>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(lead.timestamp)}</span>
          </div>
        </div>

        {/* Original Message Preview */}
        {lead.message && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1.5 font-medium">Message:</p>
            <p className="text-sm text-gray-700 line-clamp-2">
              {lead.message}
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button 
          className="w-full mt-2" 
          variant="outline"
          size="sm"
          onClick={() => setDialogOpen(true)}
        >
          View Full Details
        </Button>
      </CardContent>

      <LeadDetailsDialog 
        lead={lead}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </Card>
  );
}