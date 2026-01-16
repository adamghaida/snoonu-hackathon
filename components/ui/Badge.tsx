'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'red';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    red: 'bg-[var(--snoonu-red)]/10 text-[var(--snoonu-red)]',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function ContentTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    video: 'Video',
    reel: 'Reel',
    photo: 'Photo',
    story: 'Story',
    review: 'Review',
  };
  return <Badge variant="red">{labels[type] || type}</Badge>;
}

export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    pending: { label: 'Pending', variant: 'warning' },
    approved: { label: 'Approved', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'danger' },
    accepted: { label: 'Accepted', variant: 'success' },
    completed: { label: 'Completed', variant: 'success' },
    open: { label: 'Open', variant: 'success' },
    closed: { label: 'Closed', variant: 'default' },
    in_progress: { label: 'In Progress', variant: 'warning' },
  };
  const { label, variant } = config[status] || { label: status, variant: 'default' as const };
  return <Badge variant={variant}>{label}</Badge>;
}
