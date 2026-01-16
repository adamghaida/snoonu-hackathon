'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Input, Select } from '@/components/ui';
import { ContentType } from '@/lib/types';
import { Search } from 'lucide-react';

export function GigFilters() {
  const { filters, setFilters } = useApp();

  const contentTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'video', label: 'Video' },
    { value: 'reel', label: 'Reel' },
    { value: 'photo', label: 'Photo' },
    { value: 'story', label: 'Story' },
    { value: 'review', label: 'Review' },
  ];

  return (
    <div className="flex gap-3">
      <div className="flex-1">
        <Input
          placeholder="Search gigs..."
          value={filters.search || ''}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>
      <div className="w-40">
        <Select
          options={contentTypeOptions}
          value={filters.contentType || ''}
          onChange={e => setFilters({ ...filters, contentType: e.target.value as ContentType || undefined })}
        />
      </div>
    </div>
  );
}
