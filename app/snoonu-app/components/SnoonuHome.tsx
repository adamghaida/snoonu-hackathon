'use client';

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Bike, Star } from 'lucide-react';
import { CategoryPills } from './CategoryPills';
import { RestaurantCard, RestaurantData } from './RestaurantCard';
import { BottomNav } from './BottomNav';
import { BasketView } from './BasketView';
import { useApp } from '@/context/AppContext';
import { Creator, Application, MerchantCodeActivation, CreatorBasket } from '@/lib/types';
import * as storage from '@/lib/storage';

// Restaurant images (using placeholder service for demo)
const restaurantImages = [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', // Burger
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop', // Food spread
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', // Pizza
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', // BBQ
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', // Salad
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop', // Pancakes
];

// Placeholder videos for each restaurant (add your own video URLs here!)
// These will be used when there's no approved creator content
const placeholderVideos: Record<string, string> = {
    'merchant-1': '/videos/will.mp4', // Junior's
    'merchant-2': '', // Tea Time - add video URL here  
    'merchant-3': '', // Jiwan - add video URL here
    'merchant-4': '', // Bayt Sharq - add video URL here
    'merchant-5': '', // Pickl - add video URL here
    'merchant-6': '', // Bayt Alwaldah - add video URL here
};

interface FilterPill {
    icon?: React.ReactNode;
    label: string;
    active?: boolean;
}

export function SnoonuHome() {
    const { merchants, applications, gigs } = useApp();
    const [activeTab, setActiveTab] = useState<'delivery' | 'takeaway' | 'drivethru'>('delivery');
    const [codeActivations, setCodeActivations] = useState<MerchantCodeActivation[]>([]);
    const [creatorBaskets, setCreatorBaskets] = useState<CreatorBasket[]>([]);
    const [activeBasket, setActiveBasket] = useState<{ basket: CreatorBasket; merchantName: string } | null>(null);

    useEffect(() => {
        // Load code activations
        const activations = storage.getCodeActivations().filter(a => a.isActive);
        setCodeActivations(activations);

        // Load creator baskets
        const baskets = storage.getCreatorBaskets();
        setCreatorBaskets(baskets);
    }, []);

    // Get approved/paid applications with their content
    const approvedContent = applications.filter(
        app => app.status === 'approved' || app.status === 'paid'
    );

    // Map merchants to restaurant cards with video content
    const restaurantData: RestaurantData[] = merchants.map((merchant, index) => {
        // Check if this merchant has any approved content
        const merchantGigs = gigs.filter(g => g.merchantId === merchant.id);
        const merchantGigIds = merchantGigs.map(g => g.id);
        const contentForMerchant = approvedContent.find(app => merchantGigIds.includes(app.gigId));

        // Get creator info if there's content
        let creatorName: string | undefined;
        let creatorTier: string | undefined;
        if (contentForMerchant) {
            // For demo, we'll use a placeholder creator name
            creatorName = 'Sara Al-Mahmoud';
            creatorTier = 'silver';
        }

        // Use approved content URL, or fall back to placeholder video for this merchant
        // Only use submittedContentUrl if it looks like a video file
        const submittedUrl = contentForMerchant?.submittedContentUrl;
        const isVideoUrl = submittedUrl && (
            submittedUrl.endsWith('.mp4') ||
            submittedUrl.endsWith('.webm') ||
            submittedUrl.endsWith('.mov') ||
            submittedUrl.includes('video')
        );
        const videoUrl = (isVideoUrl ? submittedUrl : null) || placeholderVideos[merchant.id] || undefined;

        // Check for active creator codes for this merchant
        const merchantCodeActivations = codeActivations.filter(a => a.merchantId === merchant.id);
        const hasCreatorCodes = merchantCodeActivations.length > 0;
        let creatorCodeInfo: string | undefined;
        if (hasCreatorCodes) {
            const firstActivation = merchantCodeActivations[0];
            creatorCodeInfo = `Use code ${firstActivation.code} for ${firstActivation.reward.description}`;
        }

        // Get creator basket for this merchant (if any)
        const basket = creatorBaskets.find(b => b.merchantId === merchant.id);

        return {
            id: merchant.id,
            name: merchant.name,
            image: restaurantImages[index % restaurantImages.length],
            rating: Math.round(merchant.rating * 20), // Convert 4.5 -> 90%
            deliveryTime: `${20 + index * 3} mins`,
            distance: `${(1.5 + index * 0.8).toFixed(1)} km`,
            priceLevel: '$'.repeat(Math.min(3, 1 + (index % 3))),
            categories: [merchant.category, 'Fast Food'].filter(Boolean),
            supportLocal: index % 2 === 0,
            hasVideo: true, // All merchants have video button for demo
            videoUrl,
            creatorName,
            creatorTier,
            hasCreatorCodes,
            creatorCodeInfo,
            basket,
        };
    });

    // Handle shop basket click
    const handleShopBasket = (basket: CreatorBasket) => {
        const merchant = merchants.find(m => m.id === basket.merchantId);
        setActiveBasket({ basket, merchantName: merchant?.name || 'Restaurant' });
    };

    const filterPills: FilterPill[] = [
        { icon: <SlidersHorizontal className="w-4 h-4" />, label: 'Filters' },
        { icon: <ArrowUpDown className="w-4 h-4" />, label: 'Sort' },
        { icon: <Bike className="w-4 h-4 text-[#E31837]" />, label: 'Free Delivery', active: true },
        { icon: <Star className="w-4 h-4 text-yellow-400" />, label: 'Top Rated' },
    ];

    return (
        <div className="flex flex-col min-h-full bg-[#0d0d0d]">
            {/* Search Bar */}
            <div className="px-4 pt-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for Tea Time"
                        className="w-full bg-[#2a2a2a] text-white pl-10 pr-4 py-3 rounded-xl text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E31837]/50"
                    />
                </div>
            </div>

            {/* All Restaurants Header */}
            <div className="px-4 pt-5 pb-2">
                <h2 className="text-white text-xl font-bold">All Restaurants</h2>
            </div>

            {/* Delivery/Takeaway/Drive Thru Tabs */}
            <div className="px-4 pb-2">
                <div className="flex bg-[#2a2a2a] rounded-xl p-1">
                    {(['delivery', 'takeaway', 'drivethru'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab
                                ? 'bg-white text-black'
                                : 'text-gray-400'
                                }`}
                        >
                            {tab === 'delivery' && <Bike className="w-4 h-4" />}
                            {tab === 'takeaway' && '🛍️'}
                            {tab === 'drivethru' && '🚗'}
                            {tab === 'delivery' ? 'Delivery' : tab === 'takeaway' ? 'Takeaway' : 'Drive Thru'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Pills */}
            <CategoryPills />

            {/* Filter Pills */}
            <div className="px-4 py-2">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {filterPills.map((pill, index) => (
                        <button
                            key={index}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${pill.active
                                ? 'bg-[#E31837]/20 text-[#E31837] border border-[#E31837]/30'
                                : 'bg-[#2a2a2a] text-gray-300 border border-transparent'
                                }`}
                        >
                            {pill.icon}
                            {pill.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Yalla Enjoy Section */}
            <div className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-white text-lg font-bold">Yalla Enjoy!</h3>
                    <button className="text-gray-400 text-sm hover:text-white transition-colors">
                        See all
                    </button>
                </div>
            </div>

            {/* Restaurant Grid */}
            <div className="flex-1 px-4 pb-4">
                <div className="space-y-4">
                    {restaurantData.map((restaurant) => (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            onShopBasket={handleShopBasket}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />

            {/* Basket View Modal */}
            {activeBasket && (
                <BasketView
                    basket={activeBasket.basket}
                    merchantName={activeBasket.merchantName}
                    onClose={() => setActiveBasket(null)}
                />
            )}
        </div>
    );
}

