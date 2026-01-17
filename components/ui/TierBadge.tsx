'use client';

import React from 'react';
import { TierInfo } from '@/lib/types';

interface TierBadgeProps {
  tierInfo: TierInfo;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function TierBadge({ tierInfo, showLabel = true, size = 'md' }: TierBadgeProps) {
  const sizes = {
    sm: 'text-sm px-2 py-0.5',
    md: 'text-base px-3 py-1',
    lg: 'text-lg px-4 py-1.5',
  };

  return (
    <span 
      className={`inline-flex items-center gap-1 font-semibold rounded-full ${sizes[size]}`}
      style={{ 
        backgroundColor: `${tierInfo.color}20`,
        color: tierInfo.tier === 'platinum' ? '#666' : tierInfo.color,
        border: `1px solid ${tierInfo.color}40`
      }}
    >
      <span>{tierInfo.icon}</span>
      {showLabel && <span>{tierInfo.label}</span>}
    </span>
  );
}

interface TierProgressProps {
  tierInfo: TierInfo;
  totalEarnings: number;
  completedGigs: number;
}

export function TierProgress({ tierInfo, totalEarnings, completedGigs }: TierProgressProps) {
  if (!tierInfo.nextTier) {
    return (
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{tierInfo.icon}</span>
          <div>
            <p className="font-semibold">{tierInfo.label} Creator</p>
            <p className="text-xs text-[var(--muted)]">Maximum tier reached!</p>
          </div>
        </div>
        <p className="text-sm text-purple-700">
          🎉 Congratulations! You&apos;ve reached the highest tier.
        </p>
      </div>
    );
  }

  const nextTierConfig = {
    silver: { label: 'Silver', icon: '🥈' },
    gold: { label: 'Gold', icon: '🥇' },
    platinum: { label: 'Platinum', icon: '💎' },
  };

  const next = nextTierConfig[tierInfo.nextTier as keyof typeof nextTierConfig];

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{tierInfo.icon}</span>
          <span className="font-semibold">{tierInfo.label}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-[var(--muted)]">
          <span>Next: {next.icon} {next.label}</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${tierInfo.progress}%`,
            backgroundColor: tierInfo.color
          }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-[var(--muted)]">
        <span>{tierInfo.progress}% to {next.label}</span>
        <span>
          {tierInfo.gigsToNext > 0 && `${tierInfo.gigsToNext} more gigs`}
          {tierInfo.gigsToNext > 0 && tierInfo.earningsToNext > 0 && ' or '}
          {tierInfo.earningsToNext > 0 && `${tierInfo.earningsToNext.toLocaleString()} QAR`}
        </span>
      </div>
    </div>
  );
}

export function TierCard({ tierInfo, totalEarnings, completedGigs }: TierProgressProps) {
  return (
    <div className="space-y-4">
      <TierProgress tierInfo={tierInfo} totalEarnings={totalEarnings} completedGigs={completedGigs} />
      
      {/* Tier benefits */}
      <div className="text-sm">
        <p className="font-medium mb-2">Your {tierInfo.label} Benefits:</p>
        <ul className="space-y-1 text-[var(--muted)]">
          {tierInfo.tier === 'bronze' && (
            <>
              <li>✓ Access to all public gigs</li>
              <li>✓ Direct messaging with merchants</li>
            </>
          )}
          {tierInfo.tier === 'silver' && (
            <>
              <li>✓ All Bronze benefits</li>
              <li>✓ Priority application review</li>
              <li>✓ Silver badge on profile</li>
            </>
          )}
          {tierInfo.tier === 'gold' && (
            <>
              <li>✓ All Silver benefits</li>
              <li>✓ Featured in merchant search</li>
              <li>✓ Early access to new gigs</li>
            </>
          )}
          {tierInfo.tier === 'platinum' && (
            <>
              <li>✓ All Gold benefits</li>
              <li>✓ Exclusive high-paying gigs</li>
              <li>✓ Dedicated support</li>
              <li>✓ Snoonu partnership opportunities</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

