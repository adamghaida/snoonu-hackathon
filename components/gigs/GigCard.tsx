'use client';

import React from 'react';
import Link from 'next/link';
import { Card, ContentTypeBadge } from '@/components/ui';
import { Gig } from '@/lib/types';
import { Calendar, Users, DollarSign } from 'lucide-react';

interface GigCardProps {
  gig: Gig;
}

export function GigCard({ gig }: GigCardProps) {
  const daysUntilDeadline = Math.ceil(
    (new Date(gig.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link href={`/gigs/${gig.id}`}>
      <Card hover className="h-full flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {gig.merchant && (
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                {gig.merchant.logo}
              </div>
            )}
            <div>
              {gig.merchant && (
                <p className="text-xs text-[var(--muted)]">{gig.merchant.name}</p>
              )}
              <h3 className="font-medium text-sm line-clamp-1">{gig.title}</h3>
            </div>
          </div>
          <ContentTypeBadge type={gig.contentType} />
        </div>

        <p className="text-[var(--muted)] text-sm line-clamp-2 mb-4 flex-grow">
          {gig.description}
        </p>

        <div className="flex items-center justify-between text-sm pt-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-1 text-[var(--snoonu-red)] font-medium">
            <DollarSign className="w-4 h-4" />
            {gig.compensation.amount} QAR
          </div>
          <div className="flex items-center gap-3 text-[var(--muted)] text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {daysUntilDeadline}d
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {gig.requirements.minFollowers.toLocaleString()}+
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
