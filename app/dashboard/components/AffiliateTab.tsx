'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, TierBadge } from '@/components/ui';
import { 
    Ticket, 
    TrendingUp, 
    Store, 
    DollarSign, 
    Copy, 
    Check,
    BarChart3,
    Clock,
    ExternalLink
} from 'lucide-react';
import * as storage from '@/lib/storage';
import { CreatorCode, MerchantCodeActivation, CodeUsage, TierInfo, getCommissionRate } from '@/lib/types';
import { CodeSetupModal } from './CodeSetupModal';

interface AffiliateTabProps {
    creatorId: string;
    creatorName: string;
    tierInfo: TierInfo;
}

export function AffiliateTab({ creatorId, creatorName, tierInfo }: AffiliateTabProps) {
    const [creatorCode, setCreatorCode] = useState<CreatorCode | null>(null);
    const [activations, setActivations] = useState<MerchantCodeActivation[]>([]);
    const [usages, setUsages] = useState<CodeUsage[]>([]);
    const [showSetupModal, setShowSetupModal] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadData();
    }, [creatorId]);

    const loadData = () => {
        const code = storage.getCreatorCode(creatorId);
        setCreatorCode(code || null);
        setActivations(storage.getCodeActivationsByCreator(creatorId));
        setUsages(storage.getCodeUsagesByCreator(creatorId));
    };

    const handleCodeCreated = (code: string) => {
        setShowSetupModal(false);
        loadData();
    };

    const copyCode = () => {
        if (creatorCode) {
            navigator.clipboard.writeText(creatorCode.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const stats = storage.getAffiliateStats(creatorId);
    const commissionRate = getCommissionRate(tierInfo.tier);
    const merchants = storage.getMerchants();

    // Get last 7 days of data for chart
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
    });

    const chartData = last7Days.map(date => {
        const dayData = stats.usagesByDay.find(d => d.date === date);
        return {
            date,
            label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            uses: dayData?.uses || 0,
            earnings: dayData?.earnings || 0,
        };
    });

    const maxUses = Math.max(...chartData.map(d => d.uses), 1);

    if (!creatorCode) {
        return (
            <div className="space-y-6">
                {/* Setup Prompt */}
                <Card className="text-center py-12">
                    <div className="w-16 h-16 bg-[var(--snoonu-red)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Ticket className="w-8 h-8 text-[var(--snoonu-red)]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Create Your Affiliate Code</h3>
                    <p className="text-[var(--muted)] mb-6 max-w-md mx-auto">
                        Get your own unique code that merchants can activate on their stores. 
                        Earn commission every time someone uses your code!
                    </p>
                    <Button variant="primary" onClick={() => setShowSetupModal(true)}>
                        Create My Code
                    </Button>
                </Card>

                {/* How It Works */}
                <Card>
                    <h3 className="font-semibold mb-4">How Affiliate Codes Work</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-blue-600 font-bold">1</span>
                            </div>
                            <p className="text-sm font-medium">Create Your Code</p>
                            <p className="text-xs text-[var(--muted)]">Choose a unique code that represents you</p>
                        </div>
                        <div className="text-center p-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-blue-600 font-bold">2</span>
                            </div>
                            <p className="text-sm font-medium">Merchants Activate</p>
                            <p className="text-xs text-[var(--muted)]">Restaurants add your code with custom rewards</p>
                        </div>
                        <div className="text-center p-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-blue-600 font-bold">3</span>
                            </div>
                            <p className="text-sm font-medium">Earn Commission</p>
                            <p className="text-xs text-[var(--muted)]">Get {commissionRate}% of every order with your code</p>
                        </div>
                    </div>
                </Card>

                {showSetupModal && (
                    <CodeSetupModal
                        creatorId={creatorId}
                        creatorName={creatorName}
                        onComplete={handleCodeCreated}
                        onClose={() => setShowSetupModal(false)}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Code Display Card */}
            <Card className="bg-gradient-to-r from-[var(--snoonu-red)] to-[var(--snoonu-red-dark)] text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-sm mb-1">Your Affiliate Code</p>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold tracking-wider">{creatorCode.code}</span>
                            <button
                                onClick={copyCode}
                                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-white/80 text-sm mb-1">Commission Rate</p>
                        <p className="text-2xl font-bold">{commissionRate}%</p>
                        <TierBadge tierInfo={tierInfo} size="sm" />
                    </div>
                </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-xs text-[var(--muted)]">Total Earnings</p>
                        <p className="text-lg font-bold">{stats.totalEarnings.toFixed(0)} QAR</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs text-[var(--muted)]">Total Uses</p>
                        <p className="text-lg font-bold">{stats.totalUses}</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Store className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-xs text-[var(--muted)]">Active Merchants</p>
                        <p className="text-lg font-bold">{stats.activeMerchants}</p>
                    </div>
                </Card>
            </div>

            {/* Chart */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[var(--muted)]" />
                        Last 7 Days
                    </h3>
                </div>
                <div className="flex items-end justify-between gap-2 h-32">
                    {chartData.map((day, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full flex flex-col items-center justify-end h-24">
                                <div
                                    className="w-full bg-[var(--snoonu-red)]/20 rounded-t transition-all"
                                    style={{ height: `${(day.uses / maxUses) * 100}%`, minHeight: day.uses > 0 ? '4px' : '0' }}
                                >
                                    {day.uses > 0 && (
                                        <div className="w-full h-full bg-[var(--snoonu-red)] rounded-t" />
                                    )}
                                </div>
                            </div>
                            <span className="text-xs text-[var(--muted)]">{day.label}</span>
                            {day.uses > 0 && (
                                <span className="text-xs font-medium">{day.uses}</span>
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            {/* Active Merchants */}
            <Card>
                <h3 className="font-semibold mb-4">Merchants Using Your Code</h3>
                {activations.length === 0 ? (
                    <div className="text-center py-8 text-[var(--muted)]">
                        <Store className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No merchants have activated your code yet</p>
                        <p className="text-xs mt-1">Keep creating great content to attract partnerships!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activations.map(activation => {
                            const merchant = merchants.find(m => m.id === activation.merchantId);
                            const merchantUsages = usages.filter(u => u.merchantId === activation.merchantId);
                            const merchantEarnings = merchantUsages.reduce((sum, u) => sum + u.commission, 0);
                            
                            return (
                                <div key={activation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl border">
                                            {merchant?.logo}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{merchant?.name}</p>
                                            <p className="text-xs text-green-600">{activation.reward.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-sm">{merchantEarnings.toFixed(0)} QAR</p>
                                        <p className="text-xs text-[var(--muted)]">{merchantUsages.length} uses</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            {/* Recent Activity */}
            {usages.length > 0 && (
                <Card>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[var(--muted)]" />
                        Recent Activity
                    </h3>
                    <div className="space-y-2">
                        {usages.slice(-5).reverse().map(usage => {
                            const merchant = merchants.find(m => m.id === usage.merchantId);
                            const timeAgo = getTimeAgo(usage.usedAt);
                            return (
                                <div key={usage.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{merchant?.logo}</span>
                                        <div>
                                            <p className="text-sm">
                                                Code used at <span className="font-medium">{merchant?.name}</span>
                                            </p>
                                            <p className="text-xs text-[var(--muted)]">{timeAgo}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-green-600">+{usage.commission.toFixed(0)} QAR</span>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}
        </div>
    );
}

function getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

