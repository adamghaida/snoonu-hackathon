import { Merchant, Gig, Creator } from './types';
import {
    getMerchants,
    getGigs,
    saveMerchant,
    saveGig,
    isInitialized,
    setInitialized,
    saveCreator,
    getCreators
} from './storage';

// Sample Merchants (Restaurants in Qatar)
const sampleMerchants: Merchant[] = [
    {
        id: 'merchant-1',
        name: 'Al Shami Restaurant',
        logo: '🍖',
        category: 'Middle Eastern',
        description: 'Authentic Levantine cuisine with the finest shawarma and grills in Doha.',
        location: 'The Pearl, Qatar',
        rating: 4.8,
        totalCampaigns: 12,
    },
    {
        id: 'merchant-2',
        name: 'Burger Boutique',
        logo: '🍔',
        category: 'American',
        description: 'Gourmet burgers crafted with premium ingredients and unique flavors.',
        location: 'Lusail City',
        rating: 4.6,
        totalCampaigns: 8,
    },
    {
        id: 'merchant-3',
        name: 'Sushi Mori',
        logo: '🍣',
        category: 'Japanese',
        description: 'Premium Japanese cuisine featuring fresh sushi and traditional dishes.',
        location: 'West Bay, Doha',
        rating: 4.9,
        totalCampaigns: 15,
    },
    {
        id: 'merchant-4',
        name: 'Mama\'s Kitchen',
        logo: '🍝',
        category: 'Italian',
        description: 'Homestyle Italian cooking with handmade pasta and wood-fired pizzas.',
        location: 'Souq Waqif',
        rating: 4.7,
        totalCampaigns: 10,
    },
    {
        id: 'merchant-5',
        name: 'Spice Route',
        logo: '🍛',
        category: 'Indian',
        description: 'Authentic Indian flavors from various regions with aromatic spices.',
        location: 'Katara Cultural Village',
        rating: 4.5,
        totalCampaigns: 6,
    },
    {
        id: 'merchant-6',
        name: 'Fresh Bites',
        logo: '🥗',
        category: 'Healthy',
        description: 'Nutritious bowls, salads, and smoothies for health-conscious foodies.',
        location: 'Msheireb Downtown',
        rating: 4.4,
        totalCampaigns: 5,
    },
];

// Sample Gigs
const sampleGigs: Gig[] = [
    {
        id: 'gig-1',
        merchantId: 'merchant-1',
        title: 'Shawarma Reel Challenge',
        description: 'Create an engaging 30-60 second Instagram Reel showcasing our signature lamb shawarma. We want authentic, mouthwatering content that highlights the preparation and taste experience. The content should capture the sizzle, the wrap, and the first bite!',
        contentType: 'reel',
        deliverables: [
            '1 Instagram Reel (30-60 seconds)',
            'Tag @AlShamiQatar and @Snoonu',
            'Use hashtags: #SnoonuEats #DohaFood',
            'Story posts on day of posting',
        ],
        requirements: {
            minFollowers: 5000,
            platforms: ['instagram', 'tiktok'],
            contentStyle: 'Food content, lifestyle',
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
        title: 'New Burger Launch - Photo Series',
        description: 'We\'re launching our new Truffle Wagyu Burger and need stunning photography! Create a series of high-quality photos that make viewers crave this burger. Include detail shots, lifestyle shots, and the full burger presentation.',
        contentType: 'photo',
        deliverables: [
            '5 high-resolution photos',
            '3 Instagram carousel posts',
            'Behind-the-scenes story content',
        ],
        requirements: {
            minFollowers: 3000,
            platforms: ['instagram'],
            contentStyle: 'Food photography',
        },
        compensation: {
            amount: 750,
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
        title: 'Omakase Experience Video',
        description: 'Document the full omakase dining experience at Sushi Mori. We want a cinematic video showing the art of sushi preparation, the ambiance, and the culinary journey. This will be used for our social media and potentially TV advertising.',
        contentType: 'video',
        deliverables: [
            '1 video (2-3 minutes)',
            'Vertical cut for Instagram/TikTok',
            'Horizontal cut for YouTube',
            'Raw footage handover',
        ],
        requirements: {
            minFollowers: 10000,
            platforms: ['youtube', 'instagram', 'tiktok'],
            contentStyle: 'Cinematic food content',
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
        title: 'Pizza Night Stories',
        description: 'Create fun, engaging Instagram Stories showing a pizza night experience at Mama\'s Kitchen. Show the wood-fired oven, pizza making process, and enjoying with friends/family. We want authentic, relatable content!',
        contentType: 'story',
        deliverables: [
            '10+ Instagram Stories',
            'Save as Highlight',
            'Interactive polls and questions',
            'Tag @MamasKitchenQA',
        ],
        requirements: {
            minFollowers: 2000,
            platforms: ['instagram'],
            contentStyle: 'Casual, fun, family-friendly',
        },
        compensation: {
            amount: 300,
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
        title: 'Authentic Indian Food Review',
        description: 'Visit Spice Route and create an honest, detailed food review covering at least 5 dishes. We want genuine reactions and thoughtful commentary on flavors, presentation, and overall experience.',
        contentType: 'review',
        deliverables: [
            '1 YouTube review (5-8 minutes)',
            'Short-form clips for TikTok/Reels',
            'Written review for Google/TripAdvisor',
        ],
        requirements: {
            minFollowers: 8000,
            platforms: ['youtube', 'tiktok'],
            contentStyle: 'Food review, honest opinions',
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
        title: 'Healthy Lifestyle TikTok Series',
        description: 'Create a series of TikToks promoting our new protein bowls and smoothies. Content should appeal to fitness enthusiasts and health-conscious audience. Show workout + meal prep + enjoying Fresh Bites!',
        contentType: 'reel',
        deliverables: [
            '3 TikTok videos',
            'Cross-post to Instagram Reels',
            'Day-in-my-life style content',
        ],
        requirements: {
            minFollowers: 5000,
            platforms: ['tiktok', 'instagram'],
            contentStyle: 'Fitness, healthy lifestyle',
        },
        compensation: {
            amount: 600,
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
        title: 'Ramadan Special Campaign',
        description: 'Create content promoting our special Ramadan iftar menu. Capture the spirit of gathering, sharing meals, and the special dishes we prepare for the holy month.',
        contentType: 'video',
        deliverables: [
            '1 main video (60-90 seconds)',
            '3 short clips for Stories',
            'Carousel post with menu highlights',
        ],
        requirements: {
            minFollowers: 7000,
            platforms: ['instagram', 'tiktok'],
            contentStyle: 'Cultural, family-oriented',
        },
        compensation: {
            amount: 1500,
            currency: 'QAR',
            type: 'fixed',
        },
        deadline: '2026-03-01',
        status: 'open',
        createdAt: '2026-01-15',
    },
    {
        id: 'gig-8',
        merchantId: 'merchant-2',
        title: 'Burger Mukbang Content',
        description: 'Film a mukbang-style video trying our entire burger menu! We want entertaining, engaging content that showcases the variety and portion sizes. ASMR elements welcome!',
        contentType: 'video',
        deliverables: [
            '1 YouTube video (10-15 minutes)',
            'TikTok highlights',
            'Thumbnail images',
        ],
        requirements: {
            minFollowers: 15000,
            platforms: ['youtube', 'tiktok'],
            contentStyle: 'Mukbang, entertainment',
        },
        compensation: {
            amount: 1800,
            currency: 'QAR',
            type: 'fixed',
        },
        deadline: '2026-02-20',
        status: 'open',
        createdAt: '2026-01-09',
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
        { platform: 'youtube', username: 'Sara Eats', followers: 12000 },
    ],
    totalFollowers: 82000,
    portfolioUrls: [
        'https://instagram.com/p/example1',
        'https://tiktok.com/@saraeats/video/example',
    ],
    contentTypes: ['reel', 'video', 'photo', 'review'],
    status: 'approved',
    appliedAt: '2025-12-01',
    approvedAt: '2025-12-05',
};

// Initialize mock data
export function initializeMockData(): void {
    if (typeof window === 'undefined') return;

    if (isInitialized()) {
        return;
    }

    // Save merchants
    sampleMerchants.forEach(merchant => saveMerchant(merchant));

    // Save gigs
    sampleGigs.forEach(gig => saveGig(gig));

    // Save sample creator
    saveCreator(sampleCreator);

    setInitialized();
    console.log('Mock data initialized successfully!');
}

// Get sample merchant for demo login
export function getDemoMerchant(): Merchant {
    return sampleMerchants[0];
}

// Get sample creator for demo login
export function getDemoCreator(): Creator {
    return sampleCreator;
}

