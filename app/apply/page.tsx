'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input, Textarea, Select } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { SocialHandle, ContentType } from '@/lib/types';
import { ChevronRight, ChevronLeft, User, AtSign, Camera, CheckCircle } from 'lucide-react';

type Step = 'personal' | 'social' | 'portfolio' | 'review';

interface FormData {
    name: string;
    email: string;
    phone: string;
    bio: string;
    location: string;
    socialHandles: SocialHandle[];
    portfolioUrls: string[];
    contentTypes: ContentType[];
}

const initialFormData: FormData = {
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    socialHandles: [{ platform: 'instagram', username: '', followers: 0 }],
    portfolioUrls: [''],
    contentTypes: [],
};

export default function ApplyPage() {
    const router = useRouter();
    const { applyAsCreator } = useApp();
    const [step, setStep] = useState<Step>('personal');
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
        { id: 'personal', label: 'Personal', icon: <User className="w-4 h-4" /> },
        { id: 'social', label: 'Social', icon: <AtSign className="w-4 h-4" /> },
        { id: 'portfolio', label: 'Portfolio', icon: <Camera className="w-4 h-4" /> },
        { id: 'review', label: 'Review', icon: <CheckCircle className="w-4 h-4" /> },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === step);

    const handleNext = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
            setStep(steps[nextIndex].id);
        }
    };

    const handleBack = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setStep(steps[prevIndex].id);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const totalFollowers = formData.socialHandles
            .filter(h => h.username && h.followers > 0)
            .reduce((sum, h) => sum + h.followers, 0);

        applyAsCreator({
            ...formData,
            socialHandles: formData.socialHandles.filter(h => h.username),
            portfolioUrls: formData.portfolioUrls.filter(url => url),
            totalFollowers,
        });

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const addSocialHandle = () => {
        setFormData({
            ...formData,
            socialHandles: [...formData.socialHandles, { platform: 'instagram', username: '', followers: 0 }],
        });
    };

    const updateSocialHandle = (index: number, field: keyof SocialHandle, value: string | number) => {
        const newHandles = [...formData.socialHandles];
        newHandles[index] = { ...newHandles[index], [field]: value };
        setFormData({ ...formData, socialHandles: newHandles });
    };

    const toggleContentType = (type: ContentType) => {
        const newTypes = formData.contentTypes.includes(type)
            ? formData.contentTypes.filter(t => t !== type)
            : [...formData.contentTypes, type];
        setFormData({ ...formData, contentTypes: newTypes });
    };

    if (isSubmitted) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <Card className="max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-xl font-bold mb-2">Application Submitted!</h1>
                    <p className="text-[var(--muted)] text-sm mb-4">
                        For this demo, your application is auto-approved.
                    </p>
                    <Button variant="primary" onClick={() => router.push('/gigs')}>
                        Browse Gigs
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-1">Apply as Creator</h1>
                    <p className="text-[var(--muted)] text-sm">Join the Snoonu Creator Program</p>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2 mb-6">
                    {steps.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${i <= currentStepIndex
                                    ? 'bg-[var(--snoonu-red)] text-white'
                                    : 'bg-gray-100 text-[var(--muted)]'
                                }`}>
                                {s.icon}
                                <span className="hidden sm:inline">{s.label}</span>
                            </div>
                            {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-200" />}
                        </React.Fragment>
                    ))}
                </div>

                <Card>
                    {/* Personal Info */}
                    {step === 'personal' && (
                        <div className="space-y-4">
                            <h2 className="font-semibold">Personal Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Name"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Phone"
                                    placeholder="+974 XXXX XXXX"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                                <Input
                                    label="Location"
                                    placeholder="Doha, Qatar"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                            <Textarea
                                label="Bio"
                                placeholder="Tell us about yourself..."
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            />
                        </div>
                    )}

                    {/* Social Media */}
                    {step === 'social' && (
                        <div className="space-y-4">
                            <h2 className="font-semibold">Social Media Accounts</h2>
                            {formData.socialHandles.map((handle, i) => (
                                <div key={i} className="grid grid-cols-3 gap-3">
                                    <Select
                                        label={i === 0 ? 'Platform' : undefined}
                                        options={[
                                            { value: 'instagram', label: 'Instagram' },
                                            { value: 'tiktok', label: 'TikTok' },
                                            { value: 'youtube', label: 'YouTube' },
                                            { value: 'twitter', label: 'Twitter' },
                                        ]}
                                        value={handle.platform}
                                        onChange={e => updateSocialHandle(i, 'platform', e.target.value)}
                                    />
                                    <Input
                                        label={i === 0 ? 'Username' : undefined}
                                        placeholder="@username"
                                        value={handle.username}
                                        onChange={e => updateSocialHandle(i, 'username', e.target.value)}
                                    />
                                    <Input
                                        label={i === 0 ? 'Followers' : undefined}
                                        type="number"
                                        placeholder="10000"
                                        value={handle.followers || ''}
                                        onChange={e => updateSocialHandle(i, 'followers', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={addSocialHandle}>
                                + Add Another
                            </Button>
                        </div>
                    )}

                    {/* Portfolio */}
                    {step === 'portfolio' && (
                        <div className="space-y-4">
                            <h2 className="font-semibold">Portfolio & Content</h2>
                            <div>
                                <label className="block text-sm font-medium mb-2">Portfolio Links</label>
                                {formData.portfolioUrls.map((url, i) => (
                                    <Input
                                        key={i}
                                        placeholder="https://..."
                                        value={url}
                                        onChange={e => {
                                            const newUrls = [...formData.portfolioUrls];
                                            newUrls[i] = e.target.value;
                                            setFormData({ ...formData, portfolioUrls: newUrls });
                                        }}
                                        className="mb-2"
                                    />
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFormData({ ...formData, portfolioUrls: [...formData.portfolioUrls, ''] })}
                                >
                                    + Add Link
                                </Button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Content Types</label>
                                <div className="flex flex-wrap gap-2">
                                    {(['video', 'reel', 'photo', 'story', 'review'] as ContentType[]).map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => toggleContentType(type)}
                                            className={`px-3 py-1.5 rounded border text-sm capitalize ${formData.contentTypes.includes(type)
                                                    ? 'border-[var(--snoonu-red)] bg-[var(--snoonu-red)]/10 text-[var(--snoonu-red)]'
                                                    : 'border-gray-200'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Review */}
                    {step === 'review' && (
                        <div className="space-y-4">
                            <h2 className="font-semibold">Review Application</h2>
                            <div className="space-y-3 text-sm">
                                <div className="p-3 bg-gray-50 rounded">
                                    <p className="text-[var(--muted)]">Name</p>
                                    <p className="font-medium">{formData.name || '-'}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded">
                                    <p className="text-[var(--muted)]">Email</p>
                                    <p className="font-medium">{formData.email || '-'}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded">
                                    <p className="text-[var(--muted)]">Social Accounts</p>
                                    <p className="font-medium">
                                        {formData.socialHandles.filter(h => h.username).map(h => `${h.platform}: ${h.username}`).join(', ') || '-'}
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded">
                                    <p className="text-[var(--muted)]">Content Types</p>
                                    <p className="font-medium capitalize">{formData.contentTypes.join(', ') || '-'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-6 pt-4 border-t">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={currentStepIndex === 0}
                            leftIcon={<ChevronLeft className="w-4 h-4" />}
                        >
                            Back
                        </Button>
                        {step === 'review' ? (
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                isLoading={isSubmitting}
                            >
                                Submit
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={handleNext}
                                rightIcon={<ChevronRight className="w-4 h-4" />}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
