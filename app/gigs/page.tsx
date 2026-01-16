'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { GigCard, GigFilters } from '@/components/gigs';
import { Card } from '@/components/ui';
import { Search } from 'lucide-react';

export default function GigsPage() {
  const { getFilteredGigs, isLoading } = useApp();
  const filteredGigs = getFilteredGigs();

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Browse Gigs</h1>
          <p className="text-[var(--muted)] text-sm">Find opportunities from Qatar&apos;s top restaurants</p>
        </div>

        <div className="mb-6">
          <GigFilters />
        </div>

        <p className="text-sm text-[var(--muted)] mb-4">{filteredGigs.length} gigs available</p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGigs.map(gig => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-[var(--muted)]">No gigs found</p>
          </Card>
        )}
      </div>
    </div>
  );
}
