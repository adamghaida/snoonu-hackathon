'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card, Button, ContentTypeBadge, StatusBadge, Textarea } from '@/components/ui';
import { getApplicationByCreatorAndGig } from '@/lib/storage';
import { ArrowLeft, Calendar, DollarSign, Users, CheckCircle, MapPin } from 'lucide-react';

export default function GigDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { gigs, currentUser, currentCreator, applyToGig, isLoading } = useApp();

    const [showApplyForm, setShowApplyForm] = useState(false);
    const [pitch, setPitch] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    const gig = gigs.find(g => g.id === params.id);

    useEffect(() => {
        if (currentCreator && gig) {
            const existing = getApplicationByCreatorAndGig(currentCreator.id, gig.id);
            if (existing) setHasApplied(true);
        }
    }, [currentCreator, gig]);

    if (isLoading) {
        return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
    }

    if (!gig) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Card className="text-center">
                    <p className="text-[var(--muted)] mb-4">Gig not found</p>
                    <Link href="/gigs"><Button variant="primary">Browse Gigs</Button></Link>
                </Card>
            </div>
        );
    }

    const daysLeft = Math.ceil((new Date(gig.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    const handleApply = async () => {
        if (!currentCreator || !pitch) return;
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 800));
        applyToGig(gig.id, pitch, []);
        setHasApplied(true);
        setShowApplyForm(false);
        setIsSubmitting(false);
    };

    return (
        <div className="py-8">
            <div className="max-w-4xl mx-auto px-4">
                <Link href="/gigs" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--foreground)] mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Link>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {/* Header */}
                        <Card>
                            <div className="flex items-start gap-4 mb-4">
                                {gig.merchant && (
                                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                        {gig.merchant.logo}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <ContentTypeBadge type={gig.contentType} />
                                        <StatusBadge status={gig.status} />
                                    </div>
                                    <h1 className="text-xl font-bold">{gig.title}</h1>
                                    {gig.merchant && <p className="text-sm text-[var(--muted)]">{gig.merchant.name}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-[var(--muted)] text-xs">Compensation</p>
                                    <p className="font-semibold text-[var(--snoonu-red)]">{gig.compensation.amount} QAR</p>
                                </div>
                                <div>
                                    <p className="text-[var(--muted)] text-xs">Deadline</p>
                                    <p className="font-medium">{daysLeft}d left</p>
                                </div>
                                <div>
                                    <p className="text-[var(--muted)] text-xs">Min Followers</p>
                                    <p className="font-medium">{gig.requirements.minFollowers.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[var(--muted)] text-xs">Applications</p>
                                    <p className="font-medium">{gig.applicationsCount || 0}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Description */}
                        <Card>
                            <h2 className="font-semibold mb-2">Description</h2>
                            <p className="text-sm text-[var(--muted)] whitespace-pre-line">{gig.description}</p>
                        </Card>

                        {/* Deliverables */}
                        <Card>
                            <h2 className="font-semibold mb-2">Deliverables</h2>
                            <ul className="space-y-2">
                                {gig.deliverables.map((d, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                        {d}
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        {/* Apply Form */}
                        {showApplyForm && !hasApplied && currentCreator && (
                            <Card className="border-[var(--snoonu-red)]">
                                <h2 className="font-semibold mb-3">Apply for this Gig</h2>
                                <Textarea
                                    placeholder="Tell the merchant why you're perfect for this gig..."
                                    value={pitch}
                                    onChange={e => setPitch(e.target.value)}
                                    className="mb-3"
                                />
                                <div className="flex gap-2">
                                    <Button variant="primary" onClick={handleApply} isLoading={isSubmitting}>
                                        Submit
                                    </Button>
                                    <Button variant="ghost" onClick={() => setShowApplyForm(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <Card className="bg-[var(--snoonu-red)] text-white">
                            {hasApplied ? (
                                <div className="text-center">
                                    <CheckCircle className="w-10 h-10 mx-auto mb-2" />
                                    <h3 className="font-semibold">Applied!</h3>
                                    <p className="text-sm text-white/80">We&apos;ll notify you when the merchant responds.</p>
                                </div>
                            ) : currentUser?.type === 'creator' ? (
                                <div className="text-center">
                                    <h3 className="font-semibold mb-2 text-black">Interested?</h3>
                                    <Button variant="secondary" className="w-full" onClick={() => setShowApplyForm(true)}>
                                        Apply Now
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <h3 className="font-semibold mb-2">Want to Apply?</h3>
                                    <Link href="/apply">
                                        <Button variant="secondary" className="w-full">Become a Creator</Button>
                                    </Link>
                                </div>
                            )}
                        </Card>

                        {gig.merchant && (
                            <Card>
                                <h3 className="font-semibold mb-3">About Merchant</h3>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                                        {gig.merchant.logo}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{gig.merchant.name}</p>
                                        <p className="text-xs text-[var(--muted)]">{gig.merchant.category}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-[var(--muted)] mb-3">{gig.merchant.description}</p>
                                <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                                    <MapPin className="w-3 h-3" />
                                    {gig.merchant.location}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
