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
export const syncUserWithBackend = () => request('/users/me/sync', 'PUT');
export const getCurrentUserFromBackend = () => request('/users/me', 'GET');
export const updateUserLocation = (locationData) => request('/users/me/location', 'PUT', locationData);

// --- User Service - Fetching other user's data ---
export const getUserSummaryById = (userId) => request(`/users/search/id/${userId}`, 'GET');
export const getArtistProfileByUsername = (username) => request(`/users/artist-profile/${username}`, 'GET');
export const getProducerProfileByUsername = (username) => request(`/users/producer-profile/${username}`, 'GET');

// --- Artist Profile API Calls ---
export const getMyArtistProfile = () => request('/users/artist-profile/me', 'GET');
export const createOrUpdateArtistProfile = (profileData) => request('/users/artist-profile/me/create', 'PUT', profileData);
export const patchMyArtistProfile = (profileData) => request('/users/artist-profile/me/patch', 'PATCH', profileData);

export const addGenreToArtistProfile = (genreId) => request(`/users/artist-profile/me/genres/add/${genreId}`, 'POST');
export const removeGenreFromArtistProfile = (genreId) => request(`/users/artist-profile/me/genres/remove/${genreId}`, 'DELETE');

export const addSkillToArtistProfile = (skillId) => request(`/users/artist-profile/me/skills/add/${skillId}`, 'POST');
export const removeSkillFromArtistProfile = (skillId) => request(`/users/artist-profile/me/skills/remove/${skillId}`, 'DELETE');

// --- Producer Profile API Calls ---
export const getMyProducerProfile = () => request('/users/producer-profile/me', 'GET');
export const createOrUpdateProducerProfile = (profileData) => request('/users/producer-profile/me/create', 'PUT', profileData);
export const patchMyProducerProfile = (profileData) => request('/users/producer-profile/me/patch', 'PATCH', profileData);

export const addGenreToProducerProfile = (genreId) => request(`/users/producer-profile/me/genres/add/${genreId}`, 'POST');
export const removeGenreFromProducerProfile = (genreId) => request(`/users/producer-profile/me/genres/remove/${genreId}`, 'DELETE');

// --- User Interaction API Calls ---
export const getMyConnections = (page = 0, size = 20, sort = '') => request(`/interactions/me/connections?page=${page}&size=${size}&sort=${sort}`, 'GET');
export const getAllMyConnections = () => request(`/interactions/me/connections/all`, 'GET');
export const getMyIncomingRequests = (page = 0, size = 10, sort = '') => request(`/interactions/me/connections/requests/incoming?page=${page}&size=${size}&sort=${sort}`, 'GET');
export const getMyOutgoingRequests = (page = 0, size = 10, sort = '') => request(`/interactions/me/connections/requests/outgoing?page=${page}&size=${size}&sort=${sort}`, 'GET');

export const sendConnectionRequest = (addresseeId) => request(`/interactions/me/connections/request/${addresseeId}`, 'POST');
export const acceptConnectionRequest = (requesterId) => request(`/interactions/me/connections/accept/${requesterId}`, 'POST');
export const rejectConnectionRequest = (requesterId) => request(`/interactions/me/connections/reject/${requesterId}`, 'DELETE');
export const removeConnection = (otherUserId) => request(`/interactions/me/connections/remove/${otherUserId}`, 'DELETE');

export const getMyBlockedUsers = (page = 0, size = 20, sort = '') => request(`/interactions/me/blocks?page=${page}&size=${size}&sort=${sort}`, 'GET');
export const unblockUser = (blockedId) => request(`/interactions/me/blocks/unblock/${blockedId}`, 'DELETE');
export const blockUser = (blockedId) => request(`/interactions/me/blocks/block/${blockedId}`, 'POST');

export const getInteractionStatusWithUser = (otherUserId) => request(`/interactions/me/status/${otherUserId}`, 'GET');


// --- General Genre & Skill API Calls (from UserService) ---
export const getAllGenres = (page = 0, size = 20, sort = 'name,asc') => request(`/genres?page=${page}&size=${size}&sort=${sort}`, 'GET');
export const getAllSkills = (page = 0, size = 20, sort = 'name,asc') => request(`/skills?page=${page}&size=${size}&sort=${sort}`, 'GET');
