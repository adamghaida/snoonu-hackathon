'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card, Button, StatusBadge, Input, TierBadge } from '@/components/ui';
import { getCreator, getApplicationsByGig, getApplicationsByCreator } from '@/lib/storage';
import { calculateTier } from '@/lib/types';
import { Plus, Briefcase, Users, CheckCircle, XCircle, Eye, DollarSign, MessageSquare, ExternalLink, Ticket, LayoutDashboard } from 'lucide-react';
import { CreatorCodesTab } from './components/CreatorCodesTab';

export default function MerchantDashboard() {
  const router = useRouter();
  const { 
    currentUser, currentMerchant, gigs, applications, 
    updateApplicationStatus, requestRevision, approveContent, markAsPaid, 
    isLoading 
  } = useApp();
  
  const [revisionModal, setRevisionModal] = useState<string | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'codes'>('overview');

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
  
  // Group by status
  const pendingApps = myApplications.filter(a => a.status === 'pending');
  const submittedApps = myApplications.filter(a => a.status === 'submitted');
  const approvedApps = myApplications.filter(a => a.status === 'approved');
  const paidApps = myApplications.filter(a => a.status === 'paid');

  // Helper to get creator tier
  const getCreatorTier = (creatorId: string) => {
    const creatorApps = applications.filter(a => a.creatorId === creatorId && a.status === 'paid');
    const earnings = creatorApps.reduce((sum, app) => {
      const gig = gigs.find(g => g.id === app.gigId);
      return sum + (gig?.compensation.amount || 0);
    }, 0);
    return calculateTier(creatorApps.length, earnings);
  };

  const handleRequestRevision = (appId: string) => {
    if (revisionFeedback) {
      requestRevision(appId, revisionFeedback);
      setRevisionModal(null);
      setRevisionFeedback('');
    }
  };

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
            onClick={() => setActiveTab('codes')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === 'codes'
                ? 'border-[var(--snoonu-red)] text-[var(--snoonu-red)]'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <Ticket className="w-4 h-4" />
            Creator Codes
          </button>
        </div>

        {/* Creator Codes Tab */}
        {activeTab === 'codes' ? (
          <CreatorCodesTab merchantId={currentMerchant.id} />
        ) : (
          <>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
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
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Pending Review</p>
              <p className="text-lg font-bold">{pendingApps.length}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Content to Review</p>
              <p className="text-lg font-bold">{submittedApps.length}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Ready to Pay</p>
              <p className="text-lg font-bold">{approvedApps.length}</p>
            </div>
          </Card>
        </div>

        {/* Revision Modal */}
        {revisionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <h3 className="font-semibold mb-4">Request Revision</h3>
              <Input
                label="Feedback for Creator"
                placeholder="Please adjust the lighting and add more close-up shots..."
                value={revisionFeedback}
                onChange={e => setRevisionFeedback(e.target.value)}
              />
              <p className="text-xs text-[var(--muted)] mt-2 mb-4">
                Be specific about what changes you need.
              </p>
              <div className="flex gap-2">
                <Button variant="primary" onClick={() => handleRequestRevision(revisionModal)} disabled={!revisionFeedback}>
                  Send Feedback
                </Button>
                <Button variant="ghost" onClick={() => { setRevisionModal(null); setRevisionFeedback(''); }}>
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Content to Review */}
        {submittedApps.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Content to Review ({submittedApps.length})
            </h2>
            <div className="space-y-3">
              {submittedApps.map(app => {
                const gig = gigs.find(g => g.id === app.gigId);
                const creator = getCreator(app.creatorId);
                if (!gig || !creator) return null;
                const tierInfo = getCreatorTier(creator.id);
                
                return (
                  <Card key={app.id} className="border-blue-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{gig.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-[var(--muted)]">{creator.name}</span>
                          <TierBadge tierInfo={tierInfo} size="sm" />
                          <span className="text-sm text-[var(--muted)]">• {creator.totalFollowers.toLocaleString()} followers</span>
                        </div>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                    
                    {app.submittedContentUrl && (
                      <a 
                        href={app.submittedContentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm text-blue-600 hover:bg-gray-100 mb-3"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Submitted Content
                      </a>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        variant="primary" 
                        size="sm"
                        leftIcon={<CheckCircle className="w-4 h-4" />}
                        onClick={() => approveContent(app.id)}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        leftIcon={<MessageSquare className="w-4 h-4" />}
                        onClick={() => setRevisionModal(app.id)}
                      >
                        Request Revision
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Ready to Pay */}
        {approvedApps.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Ready to Pay ({approvedApps.length})
            </h2>
            <div className="space-y-3">
              {approvedApps.map(app => {
                const gig = gigs.find(g => g.id === app.gigId);
                const creator = getCreator(app.creatorId);
                if (!gig || !creator) return null;
                const tierInfo = getCreatorTier(creator.id);
                
                return (
                  <Card key={app.id} className="border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{gig.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-[var(--muted)]">{creator.name}</span>
                          <TierBadge tierInfo={tierInfo} size="sm" />
                          <span className="text-sm text-[var(--muted)]">• {gig.compensation.amount} QAR</span>
                        </div>
                      </div>
                      <Button 
                        variant="primary" 
                        size="sm"
                        leftIcon={<DollarSign className="w-4 h-4" />}
                        onClick={() => markAsPaid(app.id)}
                      >
                        Mark as Paid
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Applications */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Pending Applications ({pendingApps.length})</h2>
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
                  const tierInfo = getCreatorTier(creator.id);
                  
                  return (
                    <Card key={app.id}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-sm">{gig.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-[var(--muted)]">{creator.name}</span>
                            <TierBadge tierInfo={tierInfo} size="sm" showLabel={false} />
                            <span className="text-xs text-[var(--muted)]">• {creator.totalFollowers.toLocaleString()} followers</span>
                          </div>
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
            <h2 className="text-lg font-semibold mb-4">My Campaigns ({myGigs.length})</h2>
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

        {/* Completed / Paid */}
        {paidApps.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Completed ({paidApps.length})</h2>
            <div className="space-y-3">
              {paidApps.map(app => {
                const gig = gigs.find(g => g.id === app.gigId);
                const creator = getCreator(app.creatorId);
                if (!gig || !creator) return null;
                const tierInfo = getCreatorTier(creator.id);
                
                return (
                  <Card key={app.id} className="flex items-center justify-between opacity-75">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-sm">{gig.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--muted)]">{creator.name}</span>
                          <TierBadge tierInfo={tierInfo} size="sm" showLabel={false} />
                          <span className="text-xs text-[var(--muted)]">• {gig.compensation.amount} QAR paid</span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </Card>
                );
              })}
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
