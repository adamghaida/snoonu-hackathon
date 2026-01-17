'use client';

import React from 'react';
import { UtensilsCrossed, ShoppingBasket, Store, Crown, User } from 'lucide-react';

interface NavItem {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}

export function BottomNav() {
    const navItems: NavItem[] = [
        { icon: <UtensilsCrossed className="w-5 h-5" />, label: 'Food', active: true },
        { icon: <ShoppingBasket className="w-5 h-5" />, label: 'Grocery' },
        { icon: <Store className="w-5 h-5" />, label: 'Market' },
        { icon: <Crown className="w-5 h-5" />, label: 'Royal Club' },
        { icon: <User className="w-5 h-5" />, label: 'Profile' },
    ];

    return (
        <div className="sticky bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 px-2 pt-2 pb-6">
            <div className="flex items-center justify-around">
                {navItems.map((item, index) => (
                    <button
                        key={index}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                            item.active
                                ? 'text-[#E31837]'
                                : 'text-gray-500 hover:text-gray-400'
                        }`}
                    >
                        <div className={`${item.active ? 'bg-[#E31837]/20 p-2 rounded-full' : ''}`}>
                            {item.icon}
                        </div>
                        <span className="text-xs">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

