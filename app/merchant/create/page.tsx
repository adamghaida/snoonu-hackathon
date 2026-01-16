'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Button, Card, Input, Textarea, Select } from '@/components/ui';
import { ContentType } from '@/lib/types';
import { ArrowLeft, Plus, Trash2, CheckCircle } from 'lucide-react';

export default function CreateGigPage() {
  const router = useRouter();
  const { currentUser, currentMerchant, createGig, isLoading } = useApp();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'reel' as ContentType,
    deliverables: [''],
    minFollowers: 2000,
    platforms: ['instagram'],
    compensation: 500,
    deadline: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && (!currentUser || currentUser.type !== 'merchant')) {
      router.push('/');
    }
    // Default deadline: 2 weeks
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setFormData(prev => ({ ...prev, deadline: d.toISOString().split('T')[0] }));
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentMerchant) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    createGig({
      merchantId: currentMerchant.id,
      title: formData.title,
      description: formData.description,
      contentType: formData.contentType,
      deliverables: formData.deliverables.filter(d => d),
      requirements: { minFollowers: formData.minFollowers, platforms: formData.platforms },
      compensation: { amount: formData.compensation, currency: 'QAR', type: 'fixed' },
      deadline: formData.deadline,
    });
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-xl font-bold mb-2">Gig Created!</h1>
          <p className="text-[var(--muted)] text-sm mb-4">Your campaign is now live.</p>
          <div className="flex gap-2 justify-center">
            <Link href="/merchant"><Button variant="primary">Dashboard</Button></Link>
            <Button variant="outline" onClick={() => setIsSuccess(false)}>Create Another</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/merchant" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--foreground)] mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Create a Gig</h1>
          <p className="text-[var(--muted)] text-sm">Find creators for your campaign</p>
        </div>

        <Card className="space-y-4">
          <Input
            label="Campaign Title"
            placeholder="e.g., Create a Reel for Our New Burger"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />

          <Select
            label="Content Type"
            options={[
              { value: 'video', label: 'Video' },
              { value: 'reel', label: 'Reel / TikTok' },
              { value: 'photo', label: 'Photo' },
              { value: 'story', label: 'Stories' },
              { value: 'review', label: 'Review' },
            ]}
            value={formData.contentType}
            onChange={e => setFormData({ ...formData, contentType: e.target.value as ContentType })}
          />

          <Textarea
            label="Description"
            placeholder="Describe what you're looking for..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium mb-2">Deliverables</label>
            {formData.deliverables.map((d, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  placeholder="e.g., 1 Instagram Reel (30-60 seconds)"
                  value={d}
                  onChange={e => {
                    const newD = [...formData.deliverables];
                    newD[i] = e.target.value;
                    setFormData({ ...formData, deliverables: newD });
                  }}
                />
                {formData.deliverables.length > 1 && (
                  <Button
                    variant="ghost"
                    onClick={() => setFormData({ ...formData, deliverables: formData.deliverables.filter((_, j) => j !== i) })}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setFormData({ ...formData, deliverables: [...formData.deliverables, ''] })}
              leftIcon={<Plus className="w-3 h-3" />}
            >
              Add
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Followers"
              type="number"
              value={formData.minFollowers}
              onChange={e => setFormData({ ...formData, minFollowers: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Compensation (QAR)"
              type="number"
              value={formData.compensation}
              onChange={e => setFormData({ ...formData, compensation: parseInt(e.target.value) || 0 })}
            />
          </div>

          <Input
            label="Deadline"
            type="date"
            value={formData.deadline}
            onChange={e => setFormData({ ...formData, deadline: e.target.value })}
          />

          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting} className="flex-1">
              Publish Gig
            </Button>
            <Link href="/merchant">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
