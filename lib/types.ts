// Creator types
export interface SocialHandle {
    platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
    username: string;
    followers: number;
}

export type CreatorTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface TierInfo {
    tier: CreatorTier;
    label: string;
    color: string;
    icon: string;
    nextTier: CreatorTier | null;
    gigsToNext: number;
    earningsToNext: number;
    progress: number; // 0-100
}

export interface Creator {
    id: string;
    name: string;
    email: string;
    phone: string;
    bio: string;
    location: string;
    socialHandles: SocialHandle[];
    totalFollowers: number;
    portfolioUrls: string[];
    contentTypes: ContentType[];
    status: 'pending' | 'approved' | 'rejected';
    appliedAt: string;
    approvedAt?: string;
}

// Merchant types
export interface Merchant {
    id: string;
    name: string;
    logo: string;
    category: string;
    description: string;
    location: string;
    rating: number;
    totalCampaigns: number;
}

// Gig types
export type ContentType = 'video' | 'reel' | 'photo' | 'story' | 'review';

export interface Gig {
    id: string;
    merchantId: string;
    merchant?: Merchant;
    title: string;
    description: string;
    contentType: ContentType;
    deliverables: string[];
    requirements: {
        minFollowers: number;
        platforms: string[];
        contentStyle?: string;
    };
    compensation: {
        amount: number;
        currency: string;
        type: 'fixed' | 'performance';
    };
    deadline: string;
    status: 'open' | 'in_progress' | 'closed' | 'completed';
    createdAt: string;
    applicationsCount?: number;
}

// Application status flow
export type ApplicationStatus =
    | 'pending'
    | 'accepted'
    | 'rejected'
    | 'submitted'
    | 'revision_requested'
    | 'approved'
    | 'paid';

export interface Application {
    id: string;
    gigId: string;
    creatorId: string;
    pitch: string;
    sampleUrls: string[];
    status: ApplicationStatus;
    appliedAt: string;
    respondedAt?: string;
    submittedContentUrl?: string;
    submittedAt?: string;
    revisionFeedback?: string;
    revisionRequestedAt?: string;
    approvedAt?: string;
    paidAt?: string;
}

// Filter types
export interface GigFilters {
    contentType?: ContentType;
    minCompensation?: number;
    maxCompensation?: number;
    category?: string;
    search?: string;
}

// Stats types
export interface CreatorStats {
    totalEarnings: number;
    completedGigs: number;
    pendingApplications: number;
    acceptedApplications: number;
}

// Affiliate Code types
export interface CreatorCode {
    creatorId: string;
    code: string;           // "SARA", "AHMED", etc.
    createdAt: string;
}

export interface MerchantCodeActivation {
    id: string;
    merchantId: string;
    creatorId: string;
    code: string;
    reward: {
        type: 'percentage' | 'flat' | 'freeItem';
        value: number;        // 10 for 10%, 5 for 5 QAR, etc.
        description: string;  // "10% off" or "Free karak"
    };
    isActive: boolean;
    activatedAt: string;
}

export interface CodeUsage {
    id: string;
    code: string;
    merchantId: string;
    creatorId: string;
    orderValue: number;
    commission: number;
    usedAt: string;
}

// Creator Basket types
export interface BasketItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface CreatorBasket {
    id: string;
    creatorId: string;
    merchantId: string;
    name: string;               // "Sara's Favorites" or "Ahmed's Must-Try"
    description: string;
    items: BasketItem[];
    totalPrice: number;
    affiliateCode?: string;     // Auto-apply creator's code
    createdAt: string;
}

// Commission rates by tier (base 5% + tier bonus)
export const AFFILIATE_COMMISSION_RATES: Record<CreatorTier, number> = {
    bronze: 5,
    silver: 6,
    gold: 7,
    platinum: 10,
};

export function getCommissionRate(tier: CreatorTier): number {
    return AFFILIATE_COMMISSION_RATES[tier];
}

// Tier thresholds
export const TIER_THRESHOLDS = {
    bronze: { gigs: 0, earnings: 0 },
    silver: { gigs: 3, earnings: 1500 },
    gold: { gigs: 7, earnings: 5000 },
    platinum: { gigs: 15, earnings: 15000 },
};

// Calculate creator tier based on stats
export function calculateTier(completedGigs: number, totalEarnings: number): TierInfo {
    const { bronze, silver, gold, platinum } = TIER_THRESHOLDS;

    let tier: CreatorTier = 'bronze';
    let nextTier: CreatorTier | null = 'silver';

    if (completedGigs >= platinum.gigs || totalEarnings >= platinum.earnings) {
        tier = 'platinum';
        nextTier = null;
    } else if (completedGigs >= gold.gigs || totalEarnings >= gold.earnings) {
        tier = 'gold';
        nextTier = 'platinum';
    } else if (completedGigs >= silver.gigs || totalEarnings >= silver.earnings) {
        tier = 'silver';
        nextTier = 'gold';
    }

    // Calculate progress to next tier
    let progress = 100;
    let gigsToNext = 0;
    let earningsToNext = 0;

    if (nextTier) {
        const nextThreshold = TIER_THRESHOLDS[nextTier];
        const currentThreshold = TIER_THRESHOLDS[tier];

        const gigProgress = Math.min(100, ((completedGigs - currentThreshold.gigs) / (nextThreshold.gigs - currentThreshold.gigs)) * 100);
        const earningsProgress = Math.min(100, ((totalEarnings - currentThreshold.earnings) / (nextThreshold.earnings - currentThreshold.earnings)) * 100);

        progress = Math.max(gigProgress, earningsProgress);
        gigsToNext = Math.max(0, nextThreshold.gigs - completedGigs);
        earningsToNext = Math.max(0, nextThreshold.earnings - totalEarnings);
    }

    const tierConfig = {
        bronze: { label: 'Bronze', color: '#CD7F32', icon: '🥉' },
        silver: { label: 'Silver', color: '#C0C0C0', icon: '🥈' },
        gold: { label: 'Gold', color: '#FFD700', icon: '🥇' },
        platinum: { label: 'Platinum', color: '#E5E4E2', icon: '💎' },
    };

    return {
        tier,
        ...tierConfig[tier],
        nextTier,
        gigsToNext,
        earningsToNext,
        progress: Math.round(progress),
    };
}