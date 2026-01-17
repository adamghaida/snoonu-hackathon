'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-[var(--snoonu-black)] text-white mt-auto">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[var(--snoonu-red)] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="font-bold">Snoonu Creators</span>
                    </div>

                    <div className="flex gap-6 text-sm text-gray-400">
                        <Link href="/gigs" className="hover:text-white">Browse Gigs</Link>
                        <Link href="/apply" className="hover:text-white">Apply</Link>
                        <Link href="/merchant" className="hover:text-white">Merchants</Link>
                    </div>

                    <p className="text-sm text-gray-500">
                        Snoonu Hackathon 2026
                    </p>
                </div>
            </div>
        </footer>
    );
}
