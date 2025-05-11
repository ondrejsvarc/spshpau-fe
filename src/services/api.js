import keycloak from '../keycloak';

const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8081/api/v1';

// Function to get the Keycloak token
const getAuthHeaders = () => {
    if (keycloak.authenticated && keycloak.token) {
        return {
            'Authorization': `Bearer ${keycloak.token}`,
            'Content-Type': 'application/json',
        };
    }
    return { 'Content-Type': 'application/json' };
};

// Generic request function
const request = async (endpoint, method = 'GET', body = null) => {
    const headers = getAuthHeaders();
    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_GATEWAY_URL}${endpoint}`, config);
        if (!response.ok) {
            // Handle HTTP errors
            const errorData = await response.text();
            console.error(`API Error ${response.status}: ${errorData} for ${method} ${endpoint}`);
            throw new Error(`API Error ${response.status}: ${errorData || response.statusText}`);
        }
        if (response.status === 204 || response.headers.get("content-length") === "0") {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch API error:', error);
        throw error;
    }
};

// --- User Service API Calls ---
export const syncUserWithBackend = () => {
    return request('/users/me/sync', 'PUT');
};

export const getCurrentUserFromBackend = () => {
    return request('/users/me', 'GET');
};

export const updateUserLocation = (locationData) => {
    return request('/users/me/location', 'PUT', locationData);
};
