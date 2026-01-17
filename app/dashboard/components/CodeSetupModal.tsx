'use client';

import React, { useState } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { Ticket, Check, X, AlertCircle } from 'lucide-react';
import * as storage from '@/lib/storage';

interface CodeSetupModalProps {
    creatorId: string;
    creatorName: string;
    onComplete: (code: string) => void;
    onClose: () => void;
}

export function CodeSetupModal({ creatorId, creatorName, onComplete, onClose }: CodeSetupModalProps) {
    // Suggest a code based on the creator's first name
    const suggestedCode = creatorName.split(' ')[0].toUpperCase();
    const [code, setCode] = useState(suggestedCode);
    const [error, setError] = useState('');
    const [isChecking, setIsChecking] = useState(false);

    const validateCode = (value: string): string | null => {
        if (value.length < 3) {
            return 'Code must be at least 3 characters';
        }
        if (value.length > 15) {
            return 'Code must be 15 characters or less';
        }
        if (!/^[A-Z0-9]+$/.test(value)) {
            return 'Only letters and numbers allowed';
        }
        if (!storage.isCodeAvailable(value)) {
            return 'This code is already taken';
        }
        return null;
    };

    const handleCodeChange = (value: string) => {
        const upperValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        setCode(upperValue);
        setError('');
    };

    const handleSubmit = () => {
        setIsChecking(true);
        const validationError = validateCode(code);
        
        if (validationError) {
            setError(validationError);
            setIsChecking(false);
            return;
        }

        // Save the code
        storage.saveCreatorCode({
            creatorId,
            code,
            createdAt: new Date().toISOString(),
        });

        onComplete(code);
    };

    const isValid = code.length >= 3 && !error;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--snoonu-red)]/10 rounded-lg flex items-center justify-center">
                            <Ticket className="w-5 h-5 text-[var(--snoonu-red)]" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Create Your Affiliate Code</h3>
                            <p className="text-xs text-[var(--muted)]">This will be your universal code on Snoonu</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Code Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Your Code</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => handleCodeChange(e.target.value)}
                            maxLength={15}
                            className={`w-full text-2xl font-bold tracking-wider text-center py-4 border-2 rounded-lg uppercase ${
                                error 
                                    ? 'border-red-300 bg-red-50' 
                                    : isValid 
                                        ? 'border-green-300 bg-green-50' 
                                        : 'border-gray-200'
                            }`}
                            placeholder="YOURCODE"
                        />
                        {isValid && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Check className="w-6 h-6 text-green-500" />
                            </div>
                        )}
                    </div>
                    {error && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </p>
                    )}
                    <p className="mt-2 text-xs text-[var(--muted)]">
                        3-15 characters, letters and numbers only
                    </p>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-[var(--muted)] mb-2">Preview</p>
                    <div className="bg-white border rounded-lg p-3">
                        <p className="text-sm text-gray-600">
                            Use code <span className="font-bold text-[var(--snoonu-red)]">{code || 'YOURCODE'}</span> for exclusive discounts!
                        </p>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm">
                    <p className="font-medium text-blue-800 mb-1">How it works:</p>
                    <ul className="text-blue-700 space-y-1">
                        <li>• Merchants can activate your code on their store</li>
                        <li>• You earn commission on every order with your code</li>
                        <li>• Higher tiers = better commission rates</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="primary"
                        className="flex-1"
                        onClick={handleSubmit}
                        disabled={!isValid || isChecking}
                    >
                        {isChecking ? 'Creating...' : 'Create Code'}
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Later
                    </Button>
                </div>
            </Card>
        </div>
    );
}

