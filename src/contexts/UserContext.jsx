import React, { createContext, useState, useContext, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { syncUserWithBackend, getCurrentUserFromBackend } from '../services/api';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const { keycloak, initialized } = useKeycloak();
    const [appUser, setAppUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false);
    const [userError, setUserError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (initialized && keycloak.authenticated && !appUser && !loadingUser) {
                setLoadingUser(true);
                setUserError(null);
                console.log('Keycloak authenticated, attempting to sync and fetch user data...');
                try {
                    // Step 1: Sync with backend
                    await syncUserWithBackend();
                    console.log('User sync successful.');

                    // Step 2: Fetch the user details from your backend
                    const backendUser = await getCurrentUserFromBackend();
                    console.log('Backend user data fetched:', backendUser);
                    setAppUser(backendUser);
                } catch (error) {
                    console.error('Failed to sync or fetch user data from backend:', error);
                    setUserError(error.message || 'Failed to load user data.');
                    keycloak.logout();
                } finally {
                    setLoadingUser(false);
                }
            } else if (initialized && !keycloak.authenticated) {
                setAppUser(null);
            }
        };

        fetchUserData();
    }, [initialized, keycloak.authenticated, keycloak, appUser, loadingUser]);

    return (
        <UserContext.Provider value={{ appUser, loadingUser, userError, keycloakInitialized: initialized, keycloakAuthenticated: keycloak.authenticated }}>
            {children}
        </UserContext.Provider>
    );
};