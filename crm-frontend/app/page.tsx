'use client';

import { useState, useEffect, useCallback } from 'react';
import LeadCard from './components/LeadCard';
import { Lead } from './api/leads/route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Search, 
  Users,
  Filter,
  X
} from 'lucide-react';

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/leads');
      const data = await response.json();

      if (data.success) {
        setLeads(data.leads);
      } else {
        setError(data.error || 'Failed to fetch leads');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    let filtered = [...leads];

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(lead => lead.priority === selectedPriority);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(lead => lead.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        lead =>
          lead.name.toLowerCase().includes(query) ||
          lead.company.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.message.toLowerCase().includes(query)
      );
    }

    setFilteredLeads(filtered);
  }, [leads, selectedPriority, selectedCategory, searchQuery]);

  const categories = Array.from(new Set(leads.map(lead => lead.category).filter(Boolean)));

  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.priority === 'Hot').length,
    warm: leads.filter(l => l.priority === 'Warm').length,
    cold: leads.filter(l => l.priority === 'Cold').length,
  };

  const clearFilters = () => {
    setSelectedPriority('all');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedPriority !== 'all' || selectedCategory !== 'all' || searchQuery;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
              <p className="text-sm text-gray-600 mt-0.5">Manage and track your leads</p>
            </div>
            <Button 
              onClick={fetchLeads}
              disabled={refreshing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Hot Leads</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-2xl font-semibold text-gray-900">{stats.hot}</div>
              <Badge className="bg-red-500 text-white">High</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Warm Leads</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-2xl font-semibold text-gray-900">{stats.warm}</div>
              <Badge className="bg-orange-500 text-white">Medium</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Cold Leads</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-2xl font-semibold text-gray-900">{stats.cold}</div>
              <Badge className="bg-blue-500 text-white">Low</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </CardTitle>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-sm"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 items-end">
              <div className="flex-1 min-w-[300px] max-w-[500px] space-y-2">
                <label className="text-sm font-medium text-gray-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name, email, company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Priority Level</label>
                  <Select value={selectedPriority} onValueChange={(value) => setSelectedPriority(value || 'all')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="Hot">🔥 Hot</SelectItem>
                      <SelectItem value="Warm">⚡ Warm</SelectItem>
                      <SelectItem value="Cold">❄️ Cold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Lead Category</label>
                  <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value || 'all')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800 font-medium mb-4">Error: {error}</p>
              <Button onClick={fetchLeads} variant="destructive">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Leads Grid */}
        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredLeads.length} {filteredLeads.length === 1 ? 'Lead' : 'Leads'}
                </h2>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="text-xs">Filtered</Badge>
                )}
              </div>
            </div>

            {filteredLeads.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-gray-500 text-base font-medium">No leads found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {hasActiveFilters 
                      ? 'Try adjusting your filters' 
                      : 'Submit a form to see leads here'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}