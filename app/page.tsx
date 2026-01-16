'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { GigCard } from '@/components/gigs';
import { ArrowRight, DollarSign, Users, TrendingUp, Camera } from 'lucide-react';

export default function HomePage() {
  const { gigs, isLoading } = useApp();
  const featuredGigs = gigs.filter(g => g.status === 'open').slice(0, 3);

  const benefits = [
    { icon: <DollarSign className="w-5 h-5" />, title: 'Get Paid', description: 'Earn money creating content for restaurants' },
    { icon: <Users className="w-5 h-5" />, title: 'Connect', description: 'Work with top brands in Qatar' },
    { icon: <TrendingUp className="w-5 h-5" />, title: 'Grow', description: 'Expand your reach and audience' },
    { icon: <Camera className="w-5 h-5" />, title: 'Create', description: 'Express your unique creative style' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--snoonu-red)] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              Snoonu Creator Program
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Create content for Qatar&apos;s top restaurants. Get paid for your creativity.
            </p>
            <div className="flex gap-3">
              <Link href="/apply">
                <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Apply Now
                </Button>
              </Link>
              <Link href="/gigs">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--snoonu-red)]">
                  Browse Gigs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Why Join?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((b, i) => (
              <Card key={i}>
                <div className="w-10 h-10 bg-[var(--snoonu-red)]/10 rounded-lg flex items-center justify-center text-[var(--snoonu-red)] mb-3">
                  {b.icon}
                </div>
                <h3 className="font-medium mb-1">{b.title}</h3>
                <p className="text-sm text-[var(--muted)]">{b.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gigs */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Gigs</h2>
            <Link href="/gigs">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredGigs.map(gig => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Start?</h2>
          <p className="text-[var(--muted)] mb-6">Join the Snoonu Creator Program today</p>
          <div className="flex gap-3 justify-center">
            <Link href="/apply">
              <Button variant="primary">Apply as Creator</Button>
            </Link>
            <Link href="/merchant">
              <Button variant="outline">I&apos;m a Merchant</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
