'use client';

import React from 'react';
import { PhoneFrame } from './components/PhoneFrame';
import { SnoonuHome } from './components/SnoonuHome';
import Link from 'next/link';
import { ArrowLeft, Smartphone } from 'lucide-react';

export default function SnoonuAppPage() {
    return (
        <div className="min-h-screen bg-gray-900">
            {/* Top Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link 
                        href="/"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm">Back to Creator Platform</span>
                    </Link>
                    <div className="flex items-center gap-2 text-gray-400">
                        <Smartphone className="w-5 h-5" />
                        <span className="text-sm font-medium">Snoonu App Preview</span>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="pt-16 pb-4 text-center">
                <div className="max-w-2xl mx-auto px-4">
                    <p className="text-gray-400 text-sm">
                        This is a preview of how creator content appears in the Snoonu app.
                        <br />
                        <span className="text-[#E31837]">Tap the play button</span> on any restaurant to see creator videos!
                    </p>
                </div>
            </div>

            {/* Phone Frame with App */}
            <PhoneFrame>
                <SnoonuHome />
            </PhoneFrame>
        </div>
    );
}

