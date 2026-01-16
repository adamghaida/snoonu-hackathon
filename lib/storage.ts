import { Creator, Merchant, Gig, Application } from './types';

const STORAGE_KEYS = {
  CREATORS: 'snoonu_creators',
  MERCHANTS: 'snoonu_merchants',
  GIGS: 'snoonu_gigs',
  APPLICATIONS: 'snoonu_applications',
  CURRENT_USER: 'snoonu_current_user',
  INITIALIZED: 'snoonu_initialized',
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

export function updateApplicationStatus(id: string, status: Application['status']): void {
  const applications = getApplications();
  const index = applications.findIndex(a => a.id === id);
  if (index >= 0) {
    applications[index].status = status;
    applications[index].respondedAt = new Date().toISOString();
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

