'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Creator, Merchant, Gig, Application, GigFilters, CreatorStats, ApplicationStatus } from '@/lib/types';
import * as storage from '@/lib/storage';
import { initializeMockData, getDemoCreator, getDemoMerchant } from '@/lib/data';

interface AppState {
    currentUser: { type: 'creator' | 'merchant'; id: string } | null;
    currentCreator: Creator | null;
    currentMerchant: Merchant | null;
    gigs: Gig[];
    merchants: Merchant[];
    applications: Application[];
    isLoading: boolean;
    filters: GigFilters;
}

interface AppContextType extends AppState {
    // Auth actions
    loginAsCreator: (email: string) => boolean;
    loginAsMerchant: (id: string) => void;
    logout: () => void;
    loginAsDemo: (type: 'creator' | 'merchant') => void;

    // Creator actions
    applyAsCreator: (creator: Omit<Creator, 'id' | 'status' | 'appliedAt'>) => Creator;
    applyToGig: (gigId: string, pitch: string, sampleUrls: string[]) => Application;
    submitContent: (applicationId: string, contentUrl: string) => void;

    // Merchant actions
    createGig: (gig: Omit<Gig, 'id' | 'createdAt' | 'status'>) => Gig;
    updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => void;
    requestRevision: (applicationId: string, feedback: string) => void;
    approveContent: (applicationId: string) => void;
    markAsPaid: (applicationId: string) => void;

    // Data
    refreshData: () => void;
    setFilters: (filters: GigFilters) => void;
    getCreatorStats: () => CreatorStats;
    getFilteredGigs: () => Gig[];
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
        if (!state.currentCreator) throw new Error('Must be logged in as creator');
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

    const submitContent = useCallback((applicationId: string, contentUrl: string) => {
        storage.submitContent(applicationId, contentUrl);
        refreshData();
    }, [refreshData]);

    const createGig = useCallback((gigData: Omit<Gig, 'id' | 'createdAt' | 'status'>): Gig => {
        if (!state.currentMerchant) throw new Error('Must be logged in as merchant');
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

    const updateApplicationStatus = useCallback((applicationId: string, status: ApplicationStatus) => {
        storage.updateApplicationStatus(applicationId, status);
        refreshData();
    }, [refreshData]);

    const requestRevision = useCallback((applicationId: string, feedback: string) => {
        storage.requestRevision(applicationId, feedback);
        refreshData();
    }, [refreshData]);

    const approveContent = useCallback((applicationId: string) => {
        storage.approveContent(applicationId);
        refreshData();
    }, [refreshData]);

    const markAsPaid = useCallback((applicationId: string) => {
        storage.markAsPaid(applicationId);
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
        const paid = myApplications.filter(a => a.status === 'paid');
        const pending = myApplications.filter(a => a.status === 'pending');
        const accepted = myApplications.filter(a => a.status === 'accepted' || a.status === 'submitted' || a.status === 'revision_requested');

        const totalEarnings = paid.reduce((sum, app) => {
            const gig = state.gigs.find(g => g.id === app.gigId);
            return sum + (gig?.compensation.amount || 0);
        }, 0);

        return {
            totalEarnings,
            completedGigs: paid.length,
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
        submitContent,
        createGig,
        updateApplicationStatus,
        requestRevision,
        approveContent,
        markAsPaid,
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
