import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { syncUserWithBackend, getCurrentUserFromBackend } from '../services/api';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const { keycloak, initialized } = useKeycloak();
    const [appUser, setAppUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false);
    const [userError, setUserError] = useState(null);

    const fetchUserData = useCallback(async (forceSync = false) => {
        if (initialized && keycloak.authenticated && (!appUser || forceSync) && !loadingUser) {
            setLoadingUser(true);
            setUserError(null);
            console.log('Keycloak authenticated, attempting to sync and fetch user data...');
            try {
                if (forceSync || !appUser) {
                    await syncUserWithBackend();
                    console.log('User sync successful.');
                }

                const backendUser = await getCurrentUserFromBackend();
                console.log('Backend user data fetched:', backendUser);
                setAppUser(backendUser);
            } catch (error) {
                console.error('Failed to sync or fetch user data from backend:', error);
                setUserError(error.message || 'Failed to load user data.');
            } finally {
                setLoadingUser(false);
            }
        } else if (initialized && !keycloak.authenticated) {
            setAppUser(null);
        }
    }, [initialized, keycloak, appUser, loadingUser]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const refreshAppUser = useCallback(() => {
        console.log("Explicitly refreshing appUser data...");
        fetchUserData(true);
    }, [fetchUserData]);

    return (
        <UserContext.Provider value={{ appUser, loadingUser, userError, keycloakInitialized: initialized, keycloakAuthenticated: keycloak.authenticated, refreshAppUser }}>
            {children}
        </UserContext.Provider>
    );
};