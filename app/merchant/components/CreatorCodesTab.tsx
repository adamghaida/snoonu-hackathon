'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, TierBadge } from '@/components/ui';
import { 
    Ticket, 
    Search, 
    Plus, 
    ToggleLeft, 
    ToggleRight,
    TrendingUp,
    Users,
    DollarSign,
    X,
    Percent,
    Gift
} from 'lucide-react';
import * as storage from '@/lib/storage';
import { MerchantCodeActivation, CreatorCode, CodeUsage, Creator, getCommissionRate, calculateTier } from '@/lib/types';

interface CreatorCodesTabProps {
    merchantId: string;
}

export function CreatorCodesTab({ merchantId }: CreatorCodesTabProps) {
    const [activations, setActivations] = useState<MerchantCodeActivation[]>([]);
    const [usages, setUsages] = useState<CodeUsage[]>([]);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadData();
    }, [merchantId]);

    const loadData = () => {
        setActivations(storage.getCodeActivationsByMerchant(merchantId));
        setUsages(storage.getCodeUsagesByMerchant(merchantId));
    };

    const toggleActivation = (activationId: string, isActive: boolean) => {
        storage.toggleCodeActivation(activationId, isActive);
        loadData();
    };

    // Get all creators with codes
    const creatorsWithCodes = storage.getCreatorCodes();
    const creators = storage.getCreators().filter(c => c.status === 'approved');
    
    // Stats
    const totalUses = usages.length;
    const totalCommissionPaid = usages.reduce((sum, u) => sum + u.commission, 0);
    const activeCount = activations.filter(a => a.isActive).length;

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-xs text-[var(--muted)]">Active Creators</p>
                        <p className="text-lg font-bold">{activeCount}</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs text-[var(--muted)]">Code Uses</p>
                        <p className="text-lg font-bold">{totalUses}</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-xs text-[var(--muted)]">Commission Paid</p>
                        <p className="text-lg font-bold">{totalCommissionPaid.toFixed(0)} QAR</p>
                    </div>
                </Card>
            </div>

            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Creator Partnerships</h3>
                <Button 
                    variant="primary" 
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => setShowInviteModal(true)}
                >
                    Add Creator
                </Button>
            </div>

            {/* Active Partnerships */}
            {activations.length === 0 ? (
                <Card className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Ticket className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold mb-2">No Creator Codes Yet</h3>
                    <p className="text-[var(--muted)] text-sm mb-4 max-w-md mx-auto">
                        Partner with creators to drive sales. When customers use a creator's code, 
                        they get a discount and the creator earns commission.
                    </p>
                    <Button variant="primary" onClick={() => setShowInviteModal(true)}>
                        Add First Creator
                    </Button>
                </Card>
            ) : (
                <div className="space-y-3">
                    {activations.map(activation => {
                        const creator = creators.find(c => c.id === activation.creatorId);
                        const activationUsages = usages.filter(u => u.creatorId === activation.creatorId);
                        const creatorApps = storage.getApplications().filter(a => a.creatorId === activation.creatorId && a.status === 'paid');
                        const earnings = creatorApps.reduce((sum, app) => {
                            const gig = storage.getGig(app.gigId);
                            return sum + (gig?.compensation.amount || 0);
                        }, 0);
                        const tierInfo = calculateTier(creatorApps.length, earnings);
                        
                        if (!creator) return null;
                        
                        return (
                            <Card key={activation.id} className={`${!activation.isActive ? 'opacity-60' : ''}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[var(--snoonu-red)]/10 rounded-full flex items-center justify-center">
                                            <span className="font-bold text-[var(--snoonu-red)]">
                                                {creator.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{creator.name}</p>
                                                <TierBadge tierInfo={tierInfo} size="sm" />
                                            </div>
                                            <p className="text-sm text-[var(--muted)]">
                                                Code: <span className="font-mono font-bold text-[var(--snoonu-red)]">{activation.code}</span>
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-xs text-[var(--muted)]">Reward</p>
                                            <p className="text-sm font-medium text-green-600">{activation.reward.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-[var(--muted)]">Uses</p>
                                            <p className="text-sm font-medium">{activationUsages.length}</p>
                                        </div>
                                        <button
                                            onClick={() => toggleActivation(activation.id, !activation.isActive)}
                                            className={`p-2 rounded-lg transition-colors ${
                                                activation.isActive 
                                                    ? 'text-green-600 hover:bg-green-50' 
                                                    : 'text-gray-400 hover:bg-gray-50'
                                            }`}
                                        >
                                            {activation.isActive ? (
                                                <ToggleRight className="w-8 h-8" />
                                            ) : (
                                                <ToggleLeft className="w-8 h-8" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <InviteCreatorModal
                    merchantId={merchantId}
                    existingActivations={activations}
                    onClose={() => setShowInviteModal(false)}
                    onComplete={() => {
                        setShowInviteModal(false);
                        loadData();
                    }}
                />
            )}
        </div>
    );
}

interface InviteCreatorModalProps {
    merchantId: string;
    existingActivations: MerchantCodeActivation[];
    onClose: () => void;
    onComplete: () => void;
}

function InviteCreatorModal({ merchantId, existingActivations, onClose, onComplete }: InviteCreatorModalProps) {
    const [step, setStep] = useState<'select' | 'configure'>('select');
    const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
    const [selectedCode, setSelectedCode] = useState<CreatorCode | null>(null);
    const [rewardType, setRewardType] = useState<'percentage' | 'flat' | 'freeItem'>('percentage');
    const [rewardValue, setRewardValue] = useState('10');
    const [rewardDescription, setRewardDescription] = useState('10% off');
    const [searchQuery, setSearchQuery] = useState('');
    const [newCodeInput, setNewCodeInput] = useState('');

    // Get all creator codes
    const creatorsWithCodes = storage.getCreatorCodes();
    const activatedCreatorIds = existingActivations.map(a => a.creatorId);
    
    // Show ALL approved creators (not just those with codes)
    const availableCreators = storage.getCreators()
        .filter(c => c.status === 'approved')
        .filter(c => !activatedCreatorIds.includes(c.id))
        .filter(c => searchQuery === '' || 
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            creatorsWithCodes.find(code => code.creatorId === c.id)?.code.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const handleSelectCreator = (creator: Creator) => {
        const code = creatorsWithCodes.find(c => c.creatorId === creator.id);
        setSelectedCreator(creator);
        setSelectedCode(code || null);
        // Auto-generate a code suggestion from creator's name
        if (!code) {
            const suggestedCode = creator.name.split(' ')[0].toUpperCase();
            setNewCodeInput(suggestedCode);
        }
        setStep('configure');
    };

    const updateRewardDescription = (type: string, value: string) => {
        if (type === 'percentage') {
            setRewardDescription(`${value}% off`);
        } else if (type === 'flat') {
            setRewardDescription(`${value} QAR off`);
        }
    };

    const handleActivate = () => {
        if (!selectedCreator) return;

        let codeToUse = selectedCode?.code;

        // If creator doesn't have a code, create one for them
        if (!selectedCode && newCodeInput.trim()) {
            const newCode: CreatorCode = {
                creatorId: selectedCreator.id,
                code: newCodeInput.trim().toUpperCase(),
                createdAt: new Date().toISOString(),
            };
            storage.saveCreatorCode(newCode);
            codeToUse = newCode.code;
        }

        if (!codeToUse) return;

        const activation: MerchantCodeActivation = {
            id: storage.generateId(),
            merchantId,
            creatorId: selectedCreator.id,
            code: codeToUse,
            reward: {
                type: rewardType,
                value: parseFloat(rewardValue) || 0,
                description: rewardDescription,
            },
            isActive: true,
            activatedAt: new Date().toISOString(),
        };

        storage.saveCodeActivation(activation);
        onComplete();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                    <h3 className="font-semibold">
                        {step === 'select' ? 'Select Creator' : 'Configure Reward'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {step === 'select' ? (
                    <>
                        {/* Search */}
                        <div className="py-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by name or code..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--snoonu-red)]/50"
                                />
                            </div>
                        </div>

                        {/* Creator List */}
                        <div className="flex-1 overflow-y-auto space-y-2">
                            {availableCreators.length === 0 ? (
                                <div className="text-center py-8 text-[var(--muted)]">
                                    <p className="text-sm">No available creators found</p>
                                    <p className="text-xs mt-1">All creators with codes are already added</p>
                                </div>
                            ) : (
                                availableCreators.map(creator => {
                                    const code = creatorsWithCodes.find(c => c.creatorId === creator.id);
                                    const creatorApps = storage.getApplications().filter(a => a.creatorId === creator.id && a.status === 'paid');
                                    const earnings = creatorApps.reduce((sum, app) => {
                                        const gig = storage.getGig(app.gigId);
                                        return sum + (gig?.compensation.amount || 0);
                                    }, 0);
                                    const tierInfo = calculateTier(creatorApps.length, earnings);
                                    
                                    return (
                                        <button
                                            key={creator.id}
                                            onClick={() => handleSelectCreator(creator)}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
                                        >
                                            <div className="w-10 h-10 bg-[var(--snoonu-red)]/10 rounded-full flex items-center justify-center">
                                                <span className="font-bold text-[var(--snoonu-red)]">
                                                    {creator.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm">{creator.name}</span>
                                                    <TierBadge tierInfo={tierInfo} size="sm" />
                                                </div>
                                                <p className="text-xs text-[var(--muted)]">
                                                    {code ? (
                                                        <>Code: <span className="font-mono font-bold">{code.code}</span> • </>
                                                    ) : (
                                                        <span className="text-amber-600">No code yet • </span>
                                                    )}
                                                    {creator.totalFollowers.toLocaleString()} followers
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Selected Creator */}
                        <div className="py-4 border-b">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[var(--snoonu-red)]/10 rounded-full flex items-center justify-center">
                                    <span className="font-bold text-[var(--snoonu-red)] text-lg">
                                        {selectedCreator?.name.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{selectedCreator?.name}</p>
                                    {selectedCode ? (
                                        <p className="text-sm text-[var(--muted)]">
                                            Code: <span className="font-mono font-bold text-[var(--snoonu-red)]">{selectedCode.code}</span>
                                        </p>
                                    ) : (
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-[var(--muted)]">Code:</span>
                                            <input
                                                type="text"
                                                value={newCodeInput}
                                                onChange={(e) => setNewCodeInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                                                placeholder="ENTER CODE"
                                                className="px-2 py-1 border rounded text-sm font-mono font-bold text-[var(--snoonu-red)] w-32 focus:outline-none focus:ring-2 focus:ring-[var(--snoonu-red)]/50"
                                                maxLength={12}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reward Configuration */}
                        <div className="py-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Reward Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => {
                                            setRewardType('percentage');
                                            updateRewardDescription('percentage', rewardValue);
                                        }}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm ${
                                            rewardType === 'percentage'
                                                ? 'border-[var(--snoonu-red)] bg-[var(--snoonu-red)]/5 text-[var(--snoonu-red)]'
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        <Percent className="w-4 h-4" />
                                        Percentage
                                    </button>
                                    <button
                                        onClick={() => {
                                            setRewardType('flat');
                                            updateRewardDescription('flat', rewardValue);
                                        }}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm ${
                                            rewardType === 'flat'
                                                ? 'border-[var(--snoonu-red)] bg-[var(--snoonu-red)]/5 text-[var(--snoonu-red)]'
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        <DollarSign className="w-4 h-4" />
                                        Flat Amount
                                    </button>
                                    <button
                                        onClick={() => {
                                            setRewardType('freeItem');
                                            setRewardDescription('Free item');
                                        }}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm ${
                                            rewardType === 'freeItem'
                                                ? 'border-[var(--snoonu-red)] bg-[var(--snoonu-red)]/5 text-[var(--snoonu-red)]'
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        <Gift className="w-4 h-4" />
                                        Free Item
                                    </button>
                                </div>
                            </div>

                            {rewardType !== 'freeItem' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        {rewardType === 'percentage' ? 'Discount Percentage' : 'Discount Amount (QAR)'}
                                    </label>
                                    <input
                                        type="number"
                                        value={rewardValue}
                                        onChange={(e) => {
                                            setRewardValue(e.target.value);
                                            updateRewardDescription(rewardType, e.target.value);
                                        }}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--snoonu-red)]/50"
                                        placeholder={rewardType === 'percentage' ? '10' : '5'}
                                    />
                                </div>
                            )}

                            {rewardType === 'freeItem' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Free Item Description</label>
                                    <input
                                        type="text"
                                        value={rewardDescription}
                                        onChange={(e) => setRewardDescription(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--snoonu-red)]/50"
                                        placeholder="Free karak with any order"
                                    />
                                </div>
                            )}

                            {/* Preview */}
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm text-green-800">
                                    <span className="font-medium">Customer sees:</span> Use code{' '}
                                    <span className="font-bold">{selectedCode?.code || newCodeInput || '???'}</span> for{' '}
                                    <span className="font-bold">{rewardDescription}</span>!
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t flex gap-3">
                            <Button variant="ghost" onClick={() => setStep('select')}>
                                Back
                            </Button>
                            <Button 
                                variant="primary" 
                                className="flex-1" 
                                onClick={handleActivate}
                                disabled={!selectedCode && !newCodeInput.trim()}
                            >
                                {selectedCode ? 'Activate Code' : 'Create & Activate Code'}
                            </Button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}

