'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui';
import { Menu, X, User, LogOut, Store, Smartphone } from 'lucide-react';

export function Header() {
    const pathname = usePathname();
    const { currentUser, currentCreator, currentMerchant, logout, loginAsDemo } = useApp();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const navLinks = currentUser?.type === 'creator'
        ? [
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/gigs', label: 'Browse Gigs' },
            { href: '/snoonu-app', label: 'View in App', icon: <Smartphone className="w-4 h-4" /> },
        ]
        : currentUser?.type === 'merchant'
            ? [
                { href: '/merchant', label: 'Dashboard' },
                { href: '/merchant/create', label: 'Create Gig' },
                { href: '/snoonu-app', label: 'View in App', icon: <Smartphone className="w-4 h-4" /> },
            ]
            : [
                { href: '/gigs', label: 'Browse Gigs' },
                { href: '/apply', label: 'Apply as Creator' },
                { href: '/snoonu-app', label: 'Preview App', icon: <Smartphone className="w-4 h-4" /> },
            ];

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-[var(--border)]">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[var(--snoonu-red)] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="font-bold text-lg">Snoonu Creators</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium ${isActive(link.href)
                                    ? 'bg-[var(--snoonu-red)]/10 text-[var(--snoonu-red)]'
                                    : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                                    }`}
                            >
                                {'icon' in link && link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center gap-3">
                        {currentUser ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded text-sm">
                                    {currentUser.type === 'creator' ? (
                                        <>
                                            <User className="w-4 h-4" />
                                            <span>{currentCreator?.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Store className="w-4 h-4" />
                                            <span>{currentMerchant?.name}</span>
                                        </>
                                    )}
                                </div>
                                <Button variant="ghost" size="sm" onClick={logout}>
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => loginAsDemo('creator')}>
                                    Creator Demo
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => loginAsDemo('merchant')}>
                                    Merchant Demo
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <nav className="flex flex-col gap-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded text-sm ${isActive(link.href)
                                        ? 'bg-[var(--snoonu-red)]/10 text-[var(--snoonu-red)]'
                                        : 'text-[var(--muted)]'
                                        }`}
                                >
                                    {'icon' in link && link.icon}
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-4 pt-4 border-t flex flex-col gap-2">
                            {currentUser ? (
                                <Button variant="outline" size="sm" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                                    Logout
                                </Button>
                            ) : (
                                <>
                                    <Button variant="primary" size="sm" onClick={() => { loginAsDemo('creator'); setMobileMenuOpen(false); }}>
                                        Creator Demo
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => { loginAsDemo('merchant'); setMobileMenuOpen(false); }}>
                                        Merchant Demo
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
