import { Creator, Merchant, Gig, Application, ApplicationStatus, CreatorCode, MerchantCodeActivation, CodeUsage, CreatorBasket } from './types';

const STORAGE_KEYS = {
  CREATORS: 'snoonu_creators',
  MERCHANTS: 'snoonu_merchants',
  GIGS: 'snoonu_gigs',
  APPLICATIONS: 'snoonu_applications',
  CURRENT_USER: 'snoonu_current_user',
  INITIALIZED: 'snoonu_initialized',
  CREATOR_CODES: 'snoonu_creator_codes',
  CODE_ACTIVATIONS: 'snoonu_code_activations',
  CODE_USAGES: 'snoonu_code_usages',
  CREATOR_BASKETS: 'snoonu_creator_baskets',
};

// Generic storage helpers
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Creators
export function getCreators(): Creator[] {
  return getItem<Creator[]>(STORAGE_KEYS.CREATORS, []);
}

export function getCreator(id: string): Creator | undefined {
  return getCreators().find(c => c.id === id);
}

export function getCreatorByEmail(email: string): Creator | undefined {
  return getCreators().find(c => c.email.toLowerCase() === email.toLowerCase());
}

export function saveCreator(creator: Creator): void {
  const creators = getCreators();
  const index = creators.findIndex(c => c.id === creator.id);
  if (index >= 0) {
    creators[index] = creator;
  } else {
    creators.push(creator);
  }
  setItem(STORAGE_KEYS.CREATORS, creators);
}

export function updateCreatorStatus(id: string, status: Creator['status']): void {
  const creators = getCreators();
  const index = creators.findIndex(c => c.id === id);
  if (index >= 0) {
    creators[index].status = status;
    if (status === 'approved') {
      creators[index].approvedAt = new Date().toISOString();
    }
    setItem(STORAGE_KEYS.CREATORS, creators);
  }
}

// Merchants
export function getMerchants(): Merchant[] {
  return getItem<Merchant[]>(STORAGE_KEYS.MERCHANTS, []);
}

export function getMerchant(id: string): Merchant | undefined {
  return getMerchants().find(m => m.id === id);
}

export function saveMerchant(merchant: Merchant): void {
  const merchants = getMerchants();
  const index = merchants.findIndex(m => m.id === merchant.id);
  if (index >= 0) {
    merchants[index] = merchant;
  } else {
    merchants.push(merchant);
  }
  setItem(STORAGE_KEYS.MERCHANTS, merchants);
}

// Gigs
export function getGigs(): Gig[] {
  const gigs = getItem<Gig[]>(STORAGE_KEYS.GIGS, []);
  const merchants = getMerchants();
  const applications = getApplications();
  
  return gigs.map(gig => ({
    ...gig,
    merchant: merchants.find(m => m.id === gig.merchantId),
    applicationsCount: applications.filter(a => a.gigId === gig.id).length,
  }));
}

export function getGig(id: string): Gig | undefined {
  return getGigs().find(g => g.id === id);
}

export function getGigsByMerchant(merchantId: string): Gig[] {
  return getGigs().filter(g => g.merchantId === merchantId);
}

export function saveGig(gig: Gig): void {
  const gigs = getItem<Gig[]>(STORAGE_KEYS.GIGS, []);
  const index = gigs.findIndex(g => g.id === gig.id);
  // Remove computed fields before saving
  const { merchant, applicationsCount, ...gigToSave } = gig;
  if (index >= 0) {
    gigs[index] = gigToSave;
  } else {
    gigs.push(gigToSave);
  }
  setItem(STORAGE_KEYS.GIGS, gigs);
}

// Applications
export function getApplications(): Application[] {
  return getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
}

export function getApplication(id: string): Application | undefined {
  return getApplications().find(a => a.id === id);
}

export function getApplicationsByCreator(creatorId: string): Application[] {
  return getApplications().filter(a => a.creatorId === creatorId);
}

export function getApplicationsByGig(gigId: string): Application[] {
  return getApplications().filter(a => a.gigId === gigId);
}

export function getApplicationByCreatorAndGig(creatorId: string, gigId: string): Application | undefined {
  return getApplications().find(a => a.creatorId === creatorId && a.gigId === gigId);
}

export function saveApplication(application: Application): void {
  const applications = getApplications();
  const index = applications.findIndex(a => a.id === application.id);
  if (index >= 0) {
    applications[index] = application;
  } else {
    applications.push(application);
  }
  setItem(STORAGE_KEYS.APPLICATIONS, applications);
}

export function updateApplicationStatus(id: string, status: ApplicationStatus): void {
  const applications = getApplications();
  const index = applications.findIndex(a => a.id === id);
  if (index >= 0) {
    applications[index].status = status;
    applications[index].respondedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.APPLICATIONS, applications);
  }
}

// Submit content for review
export function submitContent(applicationId: string, contentUrl: string): void {
  const applications = getApplications();
  const index = applications.findIndex(a => a.id === applicationId);
  if (index >= 0) {
    applications[index].status = 'submitted';
    applications[index].submittedContentUrl = contentUrl;
    applications[index].submittedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.APPLICATIONS, applications);
  }
}

// Request revision on submitted content
export function requestRevision(applicationId: string, feedback: string): void {
  const applications = getApplications();
  const index = applications.findIndex(a => a.id === applicationId);
  if (index >= 0) {
    applications[index].status = 'revision_requested';
    applications[index].revisionFeedback = feedback;
    applications[index].revisionRequestedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.APPLICATIONS, applications);
  }
}

// Approve submitted content
export function approveContent(applicationId: string): void {
  const applications = getApplications();
  const index = applications.findIndex(a => a.id === applicationId);
  if (index >= 0) {
    applications[index].status = 'approved';
    applications[index].approvedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.APPLICATIONS, applications);
  }
}

// Mark as paid
export function markAsPaid(applicationId: string): void {
  const applications = getApplications();
  const index = applications.findIndex(a => a.id === applicationId);
  if (index >= 0) {
    applications[index].status = 'paid';
    applications[index].paidAt = new Date().toISOString();
    setItem(STORAGE_KEYS.APPLICATIONS, applications);
  }
}

// Current user session
export function setCurrentUser(user: { type: 'creator' | 'merchant'; id: string } | null): void {
  if (user) {
    setItem(STORAGE_KEYS.CURRENT_USER, user);
  } else if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function getCurrentUser(): { type: 'creator' | 'merchant'; id: string } | null {
  return getItem(STORAGE_KEYS.CURRENT_USER, null);
}

// Check if data is initialized
export function isInitialized(): boolean {
  return getItem(STORAGE_KEYS.INITIALIZED, false);
}

export function setInitialized(): void {
  setItem(STORAGE_KEYS.INITIALIZED, true);
}

// Reset all data
export function resetAllData(): void {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============ AFFILIATE CODES ============

// Creator Codes
export function getCreatorCodes(): CreatorCode[] {
  return getItem<CreatorCode[]>(STORAGE_KEYS.CREATOR_CODES, []);
}

export function getCreatorCode(creatorId: string): CreatorCode | undefined {
  return getCreatorCodes().find(c => c.creatorId === creatorId);
}

export function getCreatorCodeByCode(code: string): CreatorCode | undefined {
  return getCreatorCodes().find(c => c.code.toLowerCase() === code.toLowerCase());
}

export function isCodeAvailable(code: string): boolean {
  return !getCreatorCodeByCode(code);
}

export function saveCreatorCode(creatorCode: CreatorCode): void {
  const codes = getCreatorCodes();
  const index = codes.findIndex(c => c.creatorId === creatorCode.creatorId);
  if (index >= 0) {
    codes[index] = creatorCode;
  } else {
    codes.push(creatorCode);
  }
  setItem(STORAGE_KEYS.CREATOR_CODES, codes);
}

// Code Activations (merchant partnerships)
export function getCodeActivations(): MerchantCodeActivation[] {
  return getItem<MerchantCodeActivation[]>(STORAGE_KEYS.CODE_ACTIVATIONS, []);
}

export function getCodeActivationsByMerchant(merchantId: string): MerchantCodeActivation[] {
  return getCodeActivations().filter(a => a.merchantId === merchantId);
}

export function getCodeActivationsByCreator(creatorId: string): MerchantCodeActivation[] {
  return getCodeActivations().filter(a => a.creatorId === creatorId);
}

export function getCodeActivation(merchantId: string, creatorId: string): MerchantCodeActivation | undefined {
  return getCodeActivations().find(a => a.merchantId === merchantId && a.creatorId === creatorId);
}

export function saveCodeActivation(activation: MerchantCodeActivation): void {
  const activations = getCodeActivations();
  const index = activations.findIndex(a => a.id === activation.id);
  if (index >= 0) {
    activations[index] = activation;
  } else {
    activations.push(activation);
  }
  setItem(STORAGE_KEYS.CODE_ACTIVATIONS, activations);
}

export function toggleCodeActivation(activationId: string, isActive: boolean): void {
  const activations = getCodeActivations();
  const index = activations.findIndex(a => a.id === activationId);
  if (index >= 0) {
    activations[index].isActive = isActive;
    setItem(STORAGE_KEYS.CODE_ACTIVATIONS, activations);
  }
}

// Code Usages (tracking)
export function getCodeUsages(): CodeUsage[] {
  return getItem<CodeUsage[]>(STORAGE_KEYS.CODE_USAGES, []);
}

export function getCodeUsagesByCreator(creatorId: string): CodeUsage[] {
  return getCodeUsages().filter(u => u.creatorId === creatorId);
}

export function getCodeUsagesByMerchant(merchantId: string): CodeUsage[] {
  return getCodeUsages().filter(u => u.merchantId === merchantId);
}

export function getCodeUsagesByCode(code: string): CodeUsage[] {
  return getCodeUsages().filter(u => u.code.toLowerCase() === code.toLowerCase());
}

export function saveCodeUsage(usage: CodeUsage): void {
  const usages = getCodeUsages();
  usages.push(usage);
  setItem(STORAGE_KEYS.CODE_USAGES, usages);
}

// Affiliate stats helper
export function getAffiliateStats(creatorId: string): {
  totalUses: number;
  totalEarnings: number;
  activeMerchants: number;
  usagesByDay: { date: string; uses: number; earnings: number }[];
} {
  const usages = getCodeUsagesByCreator(creatorId);
  const activations = getCodeActivationsByCreator(creatorId).filter(a => a.isActive);
  
  // Group by day for the chart
  const usageMap = new Map<string, { uses: number; earnings: number }>();
  usages.forEach(u => {
    const date = u.usedAt.split('T')[0];
    const existing = usageMap.get(date) || { uses: 0, earnings: 0 };
    usageMap.set(date, {
      uses: existing.uses + 1,
      earnings: existing.earnings + u.commission,
    });
  });

  // Convert to array and sort by date
  const usagesByDay = Array.from(usageMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalUses: usages.length,
    totalEarnings: usages.reduce((sum, u) => sum + u.commission, 0),
    activeMerchants: activations.length,
    usagesByDay,
  };
}

// Creator Baskets
export function getCreatorBaskets(): CreatorBasket[] {
  return getItem<CreatorBasket[]>(STORAGE_KEYS.CREATOR_BASKETS, []);
}

export function getCreatorBasket(id: string): CreatorBasket | undefined {
  return getCreatorBaskets().find(b => b.id === id);
}

export function getBasketsByCreator(creatorId: string): CreatorBasket[] {
  return getCreatorBaskets().filter(b => b.creatorId === creatorId);
}

export function getBasketsByMerchant(merchantId: string): CreatorBasket[] {
  return getCreatorBaskets().filter(b => b.merchantId === merchantId);
}

export function getBasketByCreatorAndMerchant(creatorId: string, merchantId: string): CreatorBasket | undefined {
  return getCreatorBaskets().find(b => b.creatorId === creatorId && b.merchantId === merchantId);
}

export function saveCreatorBasket(basket: CreatorBasket): void {
  const baskets = getCreatorBaskets();
  const index = baskets.findIndex(b => b.id === basket.id);
  if (index >= 0) {
    baskets[index] = basket;
  } else {
    baskets.push(basket);
  }
  setItem(STORAGE_KEYS.CREATOR_BASKETS, baskets);
}

export function deleteCreatorBasket(id: string): void {
  const baskets = getCreatorBaskets().filter(b => b.id !== id);
  setItem(STORAGE_KEYS.CREATOR_BASKETS, baskets);
}