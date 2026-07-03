'use client';

import { Lead } from '../api/leads/route';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Mail, Building2, Clock, Sparkles, DollarSign, MessageSquare } from 'lucide-react';

interface LeadDetailsDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LeadDetailsDialog({ lead, open, onOpenChange }: LeadDetailsDialogProps) {
  if (!lead) return null;

  const priorityStyles = {
    Hot: 'bg-red-500',
    Warm: 'bg-orange-500',
    Cold: 'bg-blue-500',
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl !w-[90vw] h-auto overflow-hidden sm:!max-w-4xl">
        <DialogHeader className="pb-4 border-b pr-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-semibold">{lead.name}</DialogTitle>
              {lead.company && (
                <div className="flex items-center gap-2 text-gray-600 mt-2">
                  <Building2 className="w-4 h-4" />
                  <span className="text-base">{lead.company}</span>
                </div>
              )}
            </div>
            <Badge className={`${priorityStyles[lead.priority]} text-white px-4 py-1.5 font-medium shrink-0`}>
              {lead.priority} Priority
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-3">
          {/* Left Column */}
          <div className="space-y-3">
            {/* AI Summary */}
            {lead.summary && (
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide">
                    AI Summary
                  </h3>
                </div>
                <p className="text-base text-gray-700 leading-relaxed">
                  {lead.summary}
                </p>
              </div>
            )}

            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                Contact Information
              </h3>
              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-base text-blue-600 hover:text-blue-700 hover:underline font-medium"
                    >
                      {lead.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Submitted</p>
                    <p className="text-base text-gray-900 font-medium">{formatDate(lead.timestamp)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                Lead Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {lead.category && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-2">Category</p>
                    <Badge variant="secondary" className="text-sm">
                      {lead.category}
                    </Badge>
                  </div>
                )}
                {lead.budget && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-2">Budget</p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-600" />
                      <span className="text-base text-gray-900 font-medium">{lead.budget}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Original Message */}
          <div>
            {lead.message && (
              <div className="h-full flex flex-col">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Original Message
                </h3>
                <div className="bg-gray-50 rounded-lg p-5 flex-1 overflow-y-auto max-h-[50vh]">
                  <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {lead.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}