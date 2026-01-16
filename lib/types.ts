// Creator types
export interface SocialHandle {
    platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
    username: string;
    followers: number;
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

// Application types
export interface Application {
    id: string;
    gigId: string;
    creatorId: string;
    pitch: string;
    sampleUrls: string[];
    status: 'pending' | 'accepted' | 'rejected' | 'completed';
    submittedContent?: string;
    appliedAt: string;
    respondedAt?: string;
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

