'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card, Button, StatusBadge, Input, TierBadge, TierCard } from '@/components/ui';
import { GigCard } from '@/components/gigs';
import { calculateTier } from '@/lib/types';
import { DollarSign, CheckCircle, Clock, ArrowRight, Upload, ExternalLink, Trophy, Smartphone, Ticket, LayoutDashboard } from 'lucide-react';
import { AffiliateTab } from './components/AffiliateTab';

export default function CreatorDashboard() {
  const router = useRouter();
  const { currentUser, currentCreator, gigs, applications, getCreatorStats, submitContent, isLoading } = useApp();
  const [submitModal, setSubmitModal] = useState<string | null>(null);
  const [contentUrl, setContentUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'affiliate'>('overview');

  useEffect(() => {
    if (!isLoading && (!currentUser || currentUser.type !== 'creator')) {
      router.push('/');
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentCreator) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  }

  const stats = getCreatorStats();
  const tierInfo = calculateTier(stats.completedGigs, stats.totalEarnings);
  const myApplications = applications.filter(a => a.creatorId === currentCreator.id);
  const appliedGigIds = myApplications.map(a => a.gigId);
  const recommendedGigs = gigs.filter(g => g.status === 'open' && !appliedGigIds.includes(g.id)).slice(0, 3);

  // Group applications by status
  const needsAction = myApplications.filter(a => a.status === 'accepted' || a.status === 'revision_requested');
  const awaitingReview = myApplications.filter(a => a.status === 'submitted');
  const pending = myApplications.filter(a => a.status === 'pending');

  const handleSubmit = (appId: string) => {
    if (contentUrl) {
      submitContent(appId, contentUrl);
      setSubmitModal(null);
      setContentUrl('');
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with Tier */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">Welcome, {currentCreator.name.split(' ')[0]}</h1>
              <TierBadge tierInfo={tierInfo} size="sm" />
            </div>
            <p className="text-[var(--muted)] text-sm">Creator Dashboard</p>
          </div>
          <Link href="/snoonu-app">
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<Smartphone className="w-4 h-4" />}
            >
              View in App
            </Button>
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === 'overview'
                ? 'border-[var(--snoonu-red)] text-[var(--snoonu-red)]'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('affiliate')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === 'affiliate'
                ? 'border-[var(--snoonu-red)] text-[var(--snoonu-red)]'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <Ticket className="w-4 h-4" />
            Affiliate Codes
          </button>
        </div>

        {/* Affiliate Tab Content */}
        {activeTab === 'affiliate' ? (
          <AffiliateTab 
            creatorId={currentCreator.id} 
            creatorName={currentCreator.name}
            tierInfo={tierInfo}
          />
        ) : (
          <>
        {/* Stats */}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
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
            <div className="w-10 h-10 bg-[var(--snoonu-red)]/10 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-[var(--snoonu-red)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">In Progress</p>
              <p className="text-lg font-bold">{needsAction.length + awaitingReview.length}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Pending</p>
              <p className="text-lg font-bold">{pending.length}</p>
            </div>
          </Card>
        </div>

        {/* Tier Progress Card */}
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-[var(--snoonu-red)]" />
            <h2 className="font-semibold">Creator Ranking</h2>
          </div>
          <TierCard tierInfo={tierInfo} totalEarnings={stats.totalEarnings} completedGigs={stats.completedGigs} />
        </Card>

        {/* Action Required */}
        {needsAction.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--snoonu-red)] rounded-full animate-pulse"></span>
              Action Required
            </h2>
            <div className="space-y-3">
              {needsAction.map(app => {
                const gig = gigs.find(g => g.id === app.gigId);
                if (!gig) return null;
                return (
                  <Card key={app.id} className="border-[var(--snoonu-red)]">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                          {gig.merchant?.logo}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{gig.title}</p>
                          <p className="text-xs text-[var(--muted)]">{gig.merchant?.name} • {gig.compensation.amount} QAR</p>
                        </div>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                    
                    {app.status === 'revision_requested' && app.revisionFeedback && (
                      <div className="mt-3 p-3 bg-amber-50 rounded-lg text-sm">
                        <p className="font-medium text-amber-800">Revision Feedback:</p>
                        <p className="text-amber-700">{app.revisionFeedback}</p>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t flex gap-2">
                      <Button 
                        variant="primary" 
                        size="sm"
                        leftIcon={<Upload className="w-4 h-4" />}
                        onClick={() => setSubmitModal(app.id)}
                      >
                        {app.status === 'revision_requested' ? 'Resubmit Content' : 'Submit Content'}
                      </Button>
                      <Link href={`/gigs/${gig.id}`}>
                        <Button variant="ghost" size="sm">View Brief</Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit Modal */}
        {submitModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <h3 className="font-semibold mb-4">Submit Your Content</h3>
              <Input
                label="Content URL"
                placeholder="https://instagram.com/p/... or link to your content"
                value={contentUrl}
                onChange={e => setContentUrl(e.target.value)}
              />
              <p className="text-xs text-[var(--muted)] mt-2 mb-4">
                Paste the link to your published content or a Google Drive/Dropbox link for review.
              </p>
              <div className="flex gap-2">
                <Button variant="primary" onClick={() => handleSubmit(submitModal)} disabled={!contentUrl}>
                  Submit for Review
                </Button>
                <Button variant="ghost" onClick={() => { setSubmitModal(null); setContentUrl(''); }}>
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* All Applications */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">All Applications</h2>
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
                      <div className="flex items-center gap-3">
                        {app.submittedContentUrl && (
                          <a href={app.submittedContentUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm"><ExternalLink className="w-4 h-4" /></Button>
                          </a>
                        )}
                        <StatusBadge status={app.status} />
                      </div>
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
                  <span className="text-[var(--muted)]">Tier</span>
                  <TierBadge tierInfo={tierInfo} size="sm" />
                </div>
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
        </>
        )}
      </div>
    </div>
  );
}
