'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card, Button, StatusBadge } from '@/components/ui';
import { getCreator, getApplicationsByGig } from '@/lib/storage';
import { Plus, Briefcase, Users, CheckCircle, XCircle, Eye } from 'lucide-react';

export default function MerchantDashboard() {
  const router = useRouter();
  const { currentUser, currentMerchant, gigs, applications, updateApplicationStatus, isLoading } = useApp();

  useEffect(() => {
    if (!isLoading && (!currentUser || currentUser.type !== 'merchant')) {
      router.push('/');
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentMerchant) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  }

  const myGigs = gigs.filter(g => g.merchantId === currentMerchant.id);
  const myGigIds = myGigs.map(g => g.id);
  const myApplications = applications.filter(a => myGigIds.includes(a.gigId));
  const pendingApps = myApplications.filter(a => a.status === 'pending');

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{currentMerchant.name}</h1>
            <p className="text-[var(--muted)] text-sm">Merchant Dashboard</p>
          </div>
          <Link href="/merchant/create">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Create Gig
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--snoonu-red)]/10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[var(--snoonu-red)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Active Gigs</p>
              <p className="text-lg font-bold">{myGigs.filter(g => g.status === 'open').length}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Applications</p>
              <p className="text-lg font-bold">{myApplications.length}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Pending</p>
              <p className="text-lg font-bold">{pendingApps.length}</p>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Applications */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Pending Applications</h2>
            {pendingApps.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-[var(--muted)]">No pending applications</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {pendingApps.map(app => {
                  const gig = gigs.find(g => g.id === app.gigId);
                  const creator = getCreator(app.creatorId);
                  if (!gig || !creator) return null;
                  
                  return (
                    <Card key={app.id}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-sm">{gig.title}</p>
                          <p className="text-xs text-[var(--muted)]">by {creator.name}</p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="text-sm text-[var(--muted)] mb-3 line-clamp-2">{app.pitch}</p>
                      <div className="flex gap-2">
                        <Button 
                          variant="primary" 
                          size="sm"
                          leftIcon={<CheckCircle className="w-3 h-3" />}
                          onClick={() => updateApplicationStatus(app.id, 'accepted')}
                        >
                          Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          leftIcon={<XCircle className="w-3 h-3" />}
                          onClick={() => updateApplicationStatus(app.id, 'rejected')}
                        >
                          Decline
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* My Gigs */}
          <div>
            <h2 className="text-lg font-semibold mb-4">My Campaigns</h2>
            {myGigs.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-[var(--muted)] mb-3">No campaigns yet</p>
                <Link href="/merchant/create">
                  <Button variant="primary" size="sm">Create First Gig</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-3">
                {myGigs.map(gig => (
                  <Card key={gig.id} className="flex items-center justify-between">
                    <div>
                      <Link href={`/gigs/${gig.id}`} className="font-medium text-sm hover:text-[var(--snoonu-red)]">
                        {gig.title}
                      </Link>
                      <p className="text-xs text-[var(--muted)]">
                        {gig.compensation.amount} QAR • {getApplicationsByGig(gig.id).length} apps
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={gig.status} />
                      <Link href={`/gigs/${gig.id}`}>
                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
