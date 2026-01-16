'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card, Button, StatusBadge } from '@/components/ui';
import { GigCard } from '@/components/gigs';
import { DollarSign, CheckCircle, Clock, ArrowRight } from 'lucide-react';

export default function CreatorDashboard() {
  const router = useRouter();
  const { currentUser, currentCreator, gigs, applications, getCreatorStats, isLoading } = useApp();

  useEffect(() => {
    if (!isLoading && (!currentUser || currentUser.type !== 'creator')) {
      router.push('/');
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentCreator) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  }

  const stats = getCreatorStats();
  const myApplications = applications.filter(a => a.creatorId === currentCreator.id);
  const appliedGigIds = myApplications.map(a => a.gigId);
  const recommendedGigs = gigs.filter(g => g.status === 'open' && !appliedGigIds.includes(g.id)).slice(0, 3);

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Welcome, {currentCreator.name.split(' ')[0]}</h1>
          <p className="text-[var(--muted)] text-sm">Creator Dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Earnings</p>
              <p className="text-lg font-bold">{stats.totalEarnings} QAR</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Completed</p>
              <p className="text-lg font-bold">{stats.completedGigs}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Pending</p>
              <p className="text-lg font-bold">{stats.pendingApplications}</p>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Applications */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">My Applications</h2>
              <Link href="/gigs">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Browse More
                </Button>
              </Link>
            </div>

            {myApplications.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-[var(--muted)] mb-4">No applications yet</p>
                <Link href="/gigs">
                  <Button variant="primary" size="sm">Browse Gigs</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-3">
                {myApplications.map(app => {
                  const gig = gigs.find(g => g.id === app.gigId);
                  if (!gig) return null;
                  return (
                    <Card key={app.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                          {gig.merchant?.logo}
                        </div>
                        <div>
                          <Link href={`/gigs/${gig.id}`} className="font-medium text-sm hover:text-[var(--snoonu-red)]">
                            {gig.title}
                          </Link>
                          <p className="text-xs text-[var(--muted)]">{gig.merchant?.name}</p>
                        </div>
                      </div>
                      <StatusBadge status={app.status} />
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Profile */}
          <div>
            <Card>
              <h3 className="font-semibold mb-3">Profile</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Status</span>
                  <StatusBadge status={currentCreator.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Followers</span>
                  <span className="font-medium">{currentCreator.totalFollowers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Location</span>
                  <span>{currentCreator.location}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Recommended */}
        {recommendedGigs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Recommended Gigs</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {recommendedGigs.map(gig => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
