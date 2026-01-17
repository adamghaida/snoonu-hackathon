'use client';

import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneFrameProps {
    children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            {/* Phone Device Frame */}
            <div className="relative w-[375px] h-[812px] bg-black rounded-[50px] shadow-2xl border-[10px] border-gray-800 overflow-hidden">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-full z-50" />
                
                {/* Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-12 px-6 flex items-center justify-between z-40 bg-transparent">
                    <span className="text-white text-sm font-semibold ml-2">{currentTime}</span>
                    <div className="flex items-center gap-1 mr-2">
                        <Signal className="w-4 h-4 text-white" />
                        <Wifi className="w-4 h-4 text-white" />
                        <Battery className="w-5 h-5 text-white" />
                    </div>
                </div>

                {/* Screen Content */}
                <div className="absolute inset-0 pt-12 pb-0 overflow-hidden bg-[#0d0d0d]">
                    <div className="h-full overflow-y-auto scrollbar-hide">
                        {children}
                    </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/50 rounded-full z-50" />
            </div>
        </div>
    );
}

