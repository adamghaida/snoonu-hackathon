import { Merchant, Gig, Creator, Application, CreatorCode, MerchantCodeActivation, CodeUsage, CreatorBasket } from './types';
import {
    getMerchants,
    getGigs,
    saveMerchant,
    saveGig,
    isInitialized,
    setInitialized,
    saveCreator,
    saveApplication,
    getCreators,
    saveCreatorCode,
    saveCodeActivation,
    saveCodeUsage,
    saveCreatorBasket,
    generateId
} from './storage';

// Real Qatari Restaurant Brands
const sampleMerchants: Merchant[] = [
    {
        id: 'merchant-1',
        name: "Junior's",
        logo: '🍔',
        category: 'Fast Food',
        description: 'Made-in-Qatar casual fast-food chain with a focus on community and local sourcing.',
        location: 'Multiple Locations, Qatar',
        rating: 4.7,
        totalCampaigns: 15,
    },
    {
        id: 'merchant-2',
        name: 'Tea Time',
        logo: '☕',
        category: 'Café',
        description: 'Popular café chain known for karak tea and affordable snacks across Qatar.',
        location: 'Multiple Locations, Qatar',
        rating: 4.5,
        totalCampaigns: 20,
    },
    {
        id: 'merchant-3',
        name: 'Jiwan',
        logo: '🍽️',
        category: 'Fine Dining',
        description: 'High-end restaurant focused on authentic Qatari cuisine at the National Museum of Qatar.',
        location: 'National Museum, Doha',
        rating: 4.9,
        totalCampaigns: 8,
    },
    {
        id: 'merchant-4',
        name: 'Bayt Sharq',
        logo: '🏠',
        category: 'Traditional',
        description: 'Elegant restaurant serving traditional Qatari cuisine on the Corniche.',
        location: 'Corniche, Doha',
        rating: 4.8,
        totalCampaigns: 10,
    },
    {
        id: 'merchant-5',
        name: 'Pickl',
        logo: '🥒',
        category: 'Burgers',
        description: 'Premium burger chain serving fresh, high-quality fast food.',
        location: 'The Pearl, Qatar',
        rating: 4.6,
        totalCampaigns: 12,
    },
    {
        id: 'merchant-6',
        name: 'Bayt Alwaldah',
        logo: '🍲',
        category: 'Traditional',
        description: 'Preserving traditional Qatari recipes with authentic flavors and heritage.',
        location: 'Souq Waqif, Doha',
        rating: 4.7,
        totalCampaigns: 6,
    },
];

// Sample Gigs with real Qatari brands
const sampleGigs: Gig[] = [
    {
        id: 'gig-1',
        merchantId: 'merchant-1',
        title: "Junior's New Menu Launch Reel",
        description: "Create an engaging Instagram Reel showcasing our new loaded fries and signature burgers. Show the food prep, the sizzle, and your reaction to the first bite!",
        contentType: 'reel',
        deliverables: [
            '1 Instagram Reel (30-60 seconds)',
            "Tag @JuniorsQatar and @Snoonu",
            'Use hashtag #JuniorsQatar',
        ],
        requirements: {
            minFollowers: 5000,
            platforms: ['instagram', 'tiktok'],
        },
        compensation: {
            amount: 500,
            currency: 'QAR',
            type: 'fixed',
        },
        deadline: '2026-02-15',
        status: 'open',
        createdAt: '2026-01-10',
    },
    {
        id: 'gig-2',
        merchantId: 'merchant-2',
        title: 'Tea Time Karak Challenge',
        description: "Film yourself trying our famous karak tea and snacks! We want authentic reactions and a fun, casual vibe. Perfect for TikTok creators.",
        contentType: 'reel',
        deliverables: [
            '1 TikTok video',
            'Cross-post to Instagram',
            'Tag @TeaTimeQatar',
        ],
        requirements: {
            minFollowers: 3000,
            platforms: ['tiktok', 'instagram'],
        },
        compensation: {
            amount: 350,
            currency: 'QAR',
            type: 'fixed',
        },
        deadline: '2026-02-01',
        status: 'open',
        createdAt: '2026-01-08',
    },
    {
        id: 'gig-3',
        merchantId: 'merchant-3',
        title: 'Jiwan Fine Dining Experience',
        description: "Document the full Jiwan dining experience at the National Museum. We want cinematic content showing the ambiance, the Qatari dishes, and the cultural experience.",
        contentType: 'video',
        deliverables: [
            '1 video (2-3 minutes)',
            'Vertical cut for Instagram/TikTok',
            'Horizontal cut for YouTube',
        ],
        requirements: {
            minFollowers: 10000,
            platforms: ['youtube', 'instagram'],
        },
        compensation: {
            amount: 2000,
            currency: 'QAR',
            type: 'fixed',
        },
        deadline: '2026-02-28',
        status: 'open',
        createdAt: '2026-01-12',
    },
    {
        id: 'gig-4',
        merchantId: 'merchant-4',
        title: 'Bayt Sharq Sunset Stories',
        description: "Capture the magic of dining at Bayt Sharq during sunset on the Corniche. Create Instagram Stories showing the view, the traditional food, and the atmosphere.",
        contentType: 'story',
        deliverables: [
            '10+ Instagram Stories',
            'Save as Highlight',
            'Tag @BaytSharq',
        ],
        requirements: {
            minFollowers: 2000,
            platforms: ['instagram'],
        },
        compensation: {
            amount: 400,
            currency: 'QAR',
            type: 'fixed',
        },
        deadline: '2026-01-30',
        status: 'open',
        createdAt: '2026-01-14',
    },
    {
        id: 'gig-5',
        merchantId: 'merchant-5',
        title: 'Pickl Burger Review',
        description: "Create an honest food review of our signature Pickl burgers. Try at least 3 items and share your genuine reactions. We want real opinions!",
        contentType: 'review',
        deliverables: [
            '1 YouTube review (5-8 minutes)',
            'Short clips for TikTok/Reels',
        ],
        requirements: {
            minFollowers: 8000,
            platforms: ['youtube', 'tiktok'],
        },
        compensation: {
            amount: 1200,
            currency: 'QAR',
            type: 'fixed',
        },
        deadline: '2026-02-10',
        status: 'open',
        createdAt: '2026-01-11',
    },
    {
        id: 'gig-6',
        merchantId: 'merchant-6',
        title: 'Bayt Alwaldah Heritage Content',
        description: "Create content celebrating Qatari food heritage at Bayt Alwaldah. Show traditional dishes, cooking methods, and the cultural significance of our cuisine.",
        contentType: 'video',
        deliverables: [
            '1 main video (60-90 seconds)',
            '3 short clips for Stories',
        ],
        requirements: {
            minFollowers: 5000,
            platforms: ['instagram', 'tiktok'],
        },
        compensation: {
            amount: 800,
            currency: 'QAR',
            type: 'fixed',
        },
        deadline: '2026-02-05',
        status: 'open',
        createdAt: '2026-01-13',
    },
    {
        id: 'gig-7',
        merchantId: 'merchant-1',
        title: "Junior's Family Meal Photo Shoot",
        description: "Capture family-style photos of our sharing platters and combo meals. We need bright, appetizing images for our social media and app.",
        contentType: 'photo',
        deliverables: [
            '10 high-quality photos',
            '3 carousel posts',
        ],
        requirements: {
            minFollowers: 3000,
            platforms: ['instagram'],
        },
        compensation: {
            amount: 600,
            currency: 'QAR',
            type: 'fixed',
        },
        deadline: '2026-02-20',
        status: 'open',
        createdAt: '2026-01-15',
    },
    {
        id: 'gig-8',
        merchantId: 'merchant-2',
        title: 'Tea Time Ramadan Special',
        description: "Create content for our Ramadan iftar menu. Capture the spirit of gathering, sharing meals, and our special Ramadan offerings.",
        contentType: 'video',
        deliverables: [
            '1 main video (60-90 seconds)',
            'Story content',
        ],
        requirements: {
            minFollowers: 7000,
            platforms: ['instagram', 'tiktok'],
        },
        compensation: {
            amount: 1500,
            currency: 'QAR',
            type: 'fixed',
        },
        deadline: '2026-03-01',
        status: 'open',
        createdAt: '2026-01-09',
    },
];

// Completed gigs (for tier demo)
const completedGigs: Gig[] = [
    {
        id: 'gig-completed-1',
        merchantId: 'merchant-2',
        title: 'Tea Time Morning Vibe Reel',
        description: 'Morning karak content',
        contentType: 'reel',
        deliverables: ['1 Reel'],
        requirements: { minFollowers: 2000, platforms: ['instagram'] },
        compensation: { amount: 400, currency: 'QAR', type: 'fixed' },
        deadline: '2025-12-15',
        status: 'completed',
        createdAt: '2025-12-01',
    },
    {
        id: 'gig-completed-2',
        merchantId: 'merchant-5',
        title: 'Pickl Grand Opening Content',
        description: 'Grand opening coverage',
        contentType: 'video',
        deliverables: ['1 Video'],
        requirements: { minFollowers: 5000, platforms: ['instagram', 'tiktok'] },
        compensation: { amount: 800, currency: 'QAR', type: 'fixed' },
        deadline: '2025-11-20',
        status: 'completed',
        createdAt: '2025-11-10',
    },
];

// Sample approved creator for demo
const sampleCreator: Creator = {
    id: 'creator-demo',
    name: 'Sara Al-Mahmoud',
    email: 'sara@example.com',
    phone: '+974 5555 1234',
    bio: 'Food & lifestyle content creator based in Doha. Passionate about discovering hidden gems and sharing culinary adventures!',
    location: 'Doha, Qatar',
    socialHandles: [
        { platform: 'instagram', username: '@sara.eats.doha', followers: 25000 },
        { platform: 'tiktok', username: '@saraeats', followers: 45000 },
    ],
    totalFollowers: 70000,
    portfolioUrls: ['https://instagram.com/sara.eats.doha'],
    contentTypes: ['reel', 'video', 'photo', 'review'],
    status: 'approved',
    appliedAt: '2025-12-01',
    approvedAt: '2025-12-05',
};

// Sample completed applications (for tier demo - showing creator has done 2 gigs)
const completedApplications: Application[] = [
    {
        id: 'app-completed-1',
        gigId: 'gig-completed-1',
        creatorId: 'creator-demo',
        pitch: 'I would love to create a morning karak vibe reel!',
        sampleUrls: [],
        status: 'paid',
        appliedAt: '2025-12-02',
        respondedAt: '2025-12-03',
        submittedContentUrl: 'https://instagram.com/reel/example1',
        submittedAt: '2025-12-10',
        approvedAt: '2025-12-12',
        paidAt: '2025-12-14',
    },
    {
        id: 'app-completed-2',
        gigId: 'gig-completed-2',
        creatorId: 'creator-demo',
        pitch: 'Excited to cover the grand opening!',
        sampleUrls: [],
        status: 'paid',
        appliedAt: '2025-11-11',
        respondedAt: '2025-11-12',
        submittedContentUrl: 'https://instagram.com/reel/example2',
        submittedAt: '2025-11-18',
        approvedAt: '2025-11-19',
        paidAt: '2025-11-20',
    },
];

// Sample affiliate code for demo creator
const sampleCreatorCode: CreatorCode = {
    creatorId: 'creator-demo',
    code: 'SARA',
    createdAt: '2025-12-06',
};

// Sample merchant code activations
// Note: merchant-1 (Junior's) has NO pre-existing activation so demo can test lookup
const sampleCodeActivations: MerchantCodeActivation[] = [
    {
        id: 'activation-2',
        merchantId: 'merchant-2', // Tea Time
        creatorId: 'creator-demo',
        code: 'SARA',
        reward: {
            type: 'freeItem',
            value: 0,
            description: 'Free karak with any order',
        },
        isActive: true,
        activatedAt: '2025-12-15',
    },
    {
        id: 'activation-3',
        merchantId: 'merchant-5', // Pickl
        creatorId: 'creator-demo',
        code: 'SARA',
        reward: {
            type: 'percentage',
            value: 15,
            description: '15% off',
        },
        isActive: true,
        activatedAt: '2025-12-20',
    },
];

// Sample code usages for demo (last 7 days)
function generateSampleUsages(): CodeUsage[] {
    const usages: CodeUsage[] = [];
    const now = new Date();

    // Generate ~15 usages over the last 7 days
    const usageData = [
        { daysAgo: 0, count: 3, merchants: ['merchant-1', 'merchant-2', 'merchant-1'] },
        { daysAgo: 1, count: 2, merchants: ['merchant-5', 'merchant-2'] },
        { daysAgo: 2, count: 4, merchants: ['merchant-1', 'merchant-1', 'merchant-2', 'merchant-5'] },
        { daysAgo: 3, count: 1, merchants: ['merchant-2'] },
        { daysAgo: 4, count: 2, merchants: ['merchant-1', 'merchant-5'] },
        { daysAgo: 5, count: 2, merchants: ['merchant-2', 'merchant-1'] },
        { daysAgo: 6, count: 1, merchants: ['merchant-5'] },
    ];

    usageData.forEach(day => {
        day.merchants.forEach((merchantId, i) => {
            const date = new Date(now);
            date.setDate(date.getDate() - day.daysAgo);
            date.setHours(10 + i * 3, Math.floor(Math.random() * 60));

            const orderValue = 50 + Math.floor(Math.random() * 100); // 50-150 QAR
            const commission = orderValue * 0.06; // 6% for Silver tier

            usages.push({
                id: `usage-${day.daysAgo}-${i}`,
                code: 'SARA',
                merchantId,
                creatorId: 'creator-demo',
                orderValue,
                commission: Math.round(commission * 100) / 100,
                usedAt: date.toISOString(),
            });
        });
    });

    return usages;
}

// Sample Creator Baskets (curated orders from creators)
const sampleCreatorBaskets: CreatorBasket[] = [
    {
        id: 'basket-1',
        creatorId: 'creator-demo',
        merchantId: 'merchant-1',
        name: "Sara's Junior's Favorites",
        description: 'My go-to order at Junior\'s - perfect for a cheat day! 🍔',
        items: [
            { id: 'item-1', name: 'Classic Smash Burger', price: 32, quantity: 1, image: '🍔' },
            { id: 'item-2', name: 'Loaded Cheese Fries', price: 18, quantity: 1, image: '🍟' },
            { id: 'item-3', name: 'Oreo Milkshake', price: 22, quantity: 1, image: '🥤' },
        ],
        totalPrice: 72,
        affiliateCode: 'SARA',
        createdAt: '2025-12-15',
    },
    {
        id: 'basket-2',
        creatorId: 'creator-demo',
        merchantId: 'merchant-2',
        name: "Sara's Tea Time Picks",
        description: 'Best karak combo for studying or catching up with friends ☕',
        items: [
            { id: 'item-4', name: 'Karak Chai', price: 5, quantity: 2, image: '☕' },
            { id: 'item-5', name: 'Cheese Samosa', price: 8, quantity: 3, image: '🥟' },
            { id: 'item-6', name: 'Chicken Tikka Roll', price: 15, quantity: 1, image: '🌯' },
        ],
        totalPrice: 49,
        affiliateCode: 'SARA',
        createdAt: '2025-12-18',
    },
    {
        id: 'basket-3',
        creatorId: 'creator-demo',
        merchantId: 'merchant-5',
        name: "Sara's Pickl Feast",
        description: 'Premium burger experience - worth every riyal! 🥒',
        items: [
            { id: 'item-7', name: 'The OG Burger', price: 45, quantity: 1, image: '🍔' },
            { id: 'item-8', name: 'Truffle Fries', price: 25, quantity: 1, image: '🍟' },
            { id: 'item-9', name: 'Fresh Lemonade', price: 15, quantity: 1, image: '🍋' },
        ],
        totalPrice: 85,
        affiliateCode: 'SARA',
        createdAt: '2025-12-20',
    },
];

// Initialize mock data
export function initializeMockData(): void {
    if (typeof window === 'undefined') return;

    if (isInitialized()) return;

    // Save merchants
    sampleMerchants.forEach(merchant => saveMerchant(merchant));

    // Save all gigs (open + completed)
    [...sampleGigs, ...completedGigs].forEach(gig => saveGig(gig));

    // Save creator
    saveCreator(sampleCreator);

    // Save completed applications (for tier demo)
    completedApplications.forEach(app => saveApplication(app));

    // Save affiliate code for demo creator
    saveCreatorCode(sampleCreatorCode);

    // Save code activations
    sampleCodeActivations.forEach(activation => saveCodeActivation(activation));

    // Save sample code usages
    generateSampleUsages().forEach(usage => saveCodeUsage(usage));

    // Save creator baskets
    sampleCreatorBaskets.forEach(basket => saveCreatorBasket(basket));

    setInitialized();
}

export function getDemoMerchant(): Merchant {
    return sampleMerchants[0];
}

export function getDemoCreator(): Creator {
    return sampleCreator;
}
