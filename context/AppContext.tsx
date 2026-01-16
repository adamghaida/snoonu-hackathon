'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Creator, Merchant, Gig, Application, GigFilters, CreatorStats } from '@/lib/types';
import * as storage from '@/lib/storage';
import { initializeMockData, getDemoCreator, getDemoMerchant } from '@/lib/data';

interface AppState {
    // User session
    currentUser: { type: 'creator' | 'merchant'; id: string } | null;
    currentCreator: Creator | null;
    currentMerchant: Merchant | null;

    // Data
    gigs: Gig[];
    merchants: Merchant[];
    applications: Application[];

    // UI state
    isLoading: boolean;
    filters: GigFilters;
}

interface AppContextType extends AppState {
    // Auth actions
    loginAsCreator: (email: string) => boolean;
    loginAsMerchant: (id: string) => void;
    logout: () => void;

    // Creator actions
    applyAsCreator: (creator: Omit<Creator, 'id' | 'status' | 'appliedAt'>) => Creator;
    applyToGig: (gigId: string, pitch: string, sampleUrls: string[]) => Application;

    // Merchant actions
    createGig: (gig: Omit<Gig, 'id' | 'createdAt' | 'status'>) => Gig;
    updateApplicationStatus: (applicationId: string, status: Application['status']) => void;

    // Data refresh
    refreshData: () => void;
    setFilters: (filters: GigFilters) => void;

    // Stats
    getCreatorStats: () => CreatorStats;

    // Filtered gigs
    getFilteredGigs: () => Gig[];

    // Demo login
    loginAsDemo: (type: 'creator' | 'merchant') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AppState>({
        currentUser: null,
        currentCreator: null,
        currentMerchant: null,
        gigs: [],
        merchants: [],
        applications: [],
        isLoading: true,
        filters: {},
    });

    // Initialize data on mount
    useEffect(() => {
        initializeMockData();

        const user = storage.getCurrentUser();
        const gigs = storage.getGigs();
        const merchants = storage.getMerchants();
        const applications = storage.getApplications();

        let currentCreator: Creator | null = null;
        let currentMerchant: Merchant | null = null;

        if (user) {
            if (user.type === 'creator') {
                currentCreator = storage.getCreator(user.id) || null;
            } else {
                currentMerchant = storage.getMerchant(user.id) || null;
            }
        }

        setState(prev => ({
            ...prev,
            currentUser: user,
            currentCreator,
            currentMerchant,
            gigs,
            merchants,
            applications,
            isLoading: false,
        }));
    }, []);

    const refreshData = useCallback(() => {
        setState(prev => ({
            ...prev,
            gigs: storage.getGigs(),
            merchants: storage.getMerchants(),
            applications: storage.getApplications(),
        }));
    }, []);

    const loginAsCreator = useCallback((email: string): boolean => {
        const creator = storage.getCreatorByEmail(email);
        if (creator && creator.status === 'approved') {
            storage.setCurrentUser({ type: 'creator', id: creator.id });
            setState(prev => ({
                ...prev,
                currentUser: { type: 'creator', id: creator.id },
                currentCreator: creator,
                currentMerchant: null,
            }));
            return true;
        }
        return false;
    }, []);

    const loginAsMerchant = useCallback((id: string) => {
        const merchant = storage.getMerchant(id);
        if (merchant) {
            storage.setCurrentUser({ type: 'merchant', id });
            setState(prev => ({
                ...prev,
                currentUser: { type: 'merchant', id },
                currentMerchant: merchant,
                currentCreator: null,
            }));
        }
    }, []);

    const loginAsDemo = useCallback((type: 'creator' | 'merchant') => {
        if (type === 'creator') {
            const creator = getDemoCreator();
            storage.setCurrentUser({ type: 'creator', id: creator.id });
            setState(prev => ({
                ...prev,
                currentUser: { type: 'creator', id: creator.id },
                currentCreator: creator,
                currentMerchant: null,
            }));
        } else {
            const merchant = getDemoMerchant();
            storage.setCurrentUser({ type: 'merchant', id: merchant.id });
            setState(prev => ({
                ...prev,
                currentUser: { type: 'merchant', id: merchant.id },
                currentMerchant: merchant,
                currentCreator: null,
            }));
        }
    }, []);

    const logout = useCallback(() => {
        storage.setCurrentUser(null);
        setState(prev => ({
            ...prev,
            currentUser: null,
            currentCreator: null,
            currentMerchant: null,
        }));
    }, []);

    const applyAsCreator = useCallback((creatorData: Omit<Creator, 'id' | 'status' | 'appliedAt'>): Creator => {
        const creator: Creator = {
            ...creatorData,
            id: storage.generateId(),
            status: 'pending',
            appliedAt: new Date().toISOString(),
        };
        storage.saveCreator(creator);
        refreshData();
        return creator;
    }, [refreshData]);

    const applyToGig = useCallback((gigId: string, pitch: string, sampleUrls: string[]): Application => {
        if (!state.currentCreator) {
            throw new Error('Must be logged in as creator');
        }

        const application: Application = {
            id: storage.generateId(),
            gigId,
            creatorId: state.currentCreator.id,
            pitch,
            sampleUrls,
            status: 'pending',
            appliedAt: new Date().toISOString(),
        };
        storage.saveApplication(application);
        refreshData();
        return application;
    }, [state.currentCreator, refreshData]);

    const createGig = useCallback((gigData: Omit<Gig, 'id' | 'createdAt' | 'status'>): Gig => {
        if (!state.currentMerchant) {
            throw new Error('Must be logged in as merchant');
        }

        const gig: Gig = {
            ...gigData,
            id: storage.generateId(),
            merchantId: state.currentMerchant.id,
            status: 'open',
            createdAt: new Date().toISOString(),
        };
        storage.saveGig(gig);
        refreshData();
        return gig;
    }, [state.currentMerchant, refreshData]);

    const updateApplicationStatus = useCallback((applicationId: string, status: Application['status']) => {
        storage.updateApplicationStatus(applicationId, status);
        refreshData();
    }, [refreshData]);

    const setFilters = useCallback((filters: GigFilters) => {
        setState(prev => ({ ...prev, filters }));
    }, []);

    const getFilteredGigs = useCallback((): Gig[] => {
        let filtered = state.gigs.filter(g => g.status === 'open');

        if (state.filters.contentType) {
            filtered = filtered.filter(g => g.contentType === state.filters.contentType);
        }

        if (state.filters.minCompensation) {
            filtered = filtered.filter(g => g.compensation.amount >= state.filters.minCompensation!);
        }

        if (state.filters.maxCompensation) {
            filtered = filtered.filter(g => g.compensation.amount <= state.filters.maxCompensation!);
        }

        if (state.filters.category) {
            filtered = filtered.filter(g => g.merchant?.category === state.filters.category);
        }

        if (state.filters.search) {
            const search = state.filters.search.toLowerCase();
            filtered = filtered.filter(g =>
                g.title.toLowerCase().includes(search) ||
                g.description.toLowerCase().includes(search) ||
                g.merchant?.name.toLowerCase().includes(search)
            );
        }

        return filtered;
    }, [state.gigs, state.filters]);

    const getCreatorStats = useCallback((): CreatorStats => {
        if (!state.currentCreator) {
            return { totalEarnings: 0, completedGigs: 0, pendingApplications: 0, acceptedApplications: 0 };
        }

        const myApplications = state.applications.filter(a => a.creatorId === state.currentCreator!.id);
        const completed = myApplications.filter(a => a.status === 'completed');
        const pending = myApplications.filter(a => a.status === 'pending');
        const accepted = myApplications.filter(a => a.status === 'accepted');

        const totalEarnings = completed.reduce((sum, app) => {
            const gig = state.gigs.find(g => g.id === app.gigId);
            return sum + (gig?.compensation.amount || 0);
        }, 0);

        return {
            totalEarnings,
            completedGigs: completed.length,
            pendingApplications: pending.length,
            acceptedApplications: accepted.length,
        };
    }, [state.currentCreator, state.applications, state.gigs]);

    const value: AppContextType = {
        ...state,
        loginAsCreator,
        loginAsMerchant,
        loginAsDemo,
        logout,
        applyAsCreator,
        applyToGig,
        createGig,
        updateApplicationStatus,
        refreshData,
        setFilters,
        getCreatorStats,
        getFilteredGigs,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

