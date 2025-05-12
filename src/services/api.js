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
const request = async (endpoint, method = 'GET', body = null, isFormData = false) => {
    console.log(`API Request: ${method} ${endpoint}, isFormData: ${isFormData}`);

    let requestHeaders = {};

    if (keycloak.authenticated && keycloak.token) {
        requestHeaders['Authorization'] = `Bearer ${keycloak.token}`;
    }

    const config = {
        method,
        headers: requestHeaders,
    };

    if (body) {
        if (isFormData) {
            config.body = body;
        } else {
            requestHeaders['Content-Type'] = 'application/json';
            config.body = JSON.stringify(body);
        }
    }

    config.headers = requestHeaders;

    console.log('API Request: Sending with headers:', config.headers);
    if (isFormData) {
        console.log('API Request: Body is FormData, browser will set Content-Type.');
    }

    try {
        const response = await fetch(`${API_GATEWAY_URL}${endpoint}`, config);
        if (!response.ok) {
            const errorData = await response.text();
            console.error(`API Error ${response.status}: ${errorData} for ${method} ${endpoint}`);
            console.error('API Error Request Headers Sent:', config.headers);
            throw new Error(`API Error ${response.status}: ${errorData || response.statusText}`);
        }
        if (response.status === 204 || response.headers.get("content-length") === "0") {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch API error:', error);
        console.error('Fetch API error - Request Headers Sent:', config.headers);
        throw error;
    }
};

// --- User Service API Calls ---
export const syncUserWithBackend = () => request('/users/me/sync', 'PUT');
export const getCurrentUserFromBackend = () => request('/users/me', 'GET');
export const updateUserLocation = (locationData) => request('/users/me/location', 'PUT', locationData);

// --- Fetching other user's data ---
export const getUserSummaryById = (userId) => request(`/users/search/id/${userId}`, 'GET');
export const getArtistProfileByUsername = (username) => request(`/users/artist-profile/${username}`, 'GET');
export const getProducerProfileByUsername = (username) => request(`/users/producer-profile/${username}`, 'GET');

// --- Search and Matches ---
export const searchUsers = (searchCriteria, page = 0, size = 10, sort = 'username,asc') => {
    const params = new URLSearchParams();

    if (searchCriteria) {
        for (const key in searchCriteria) {
            if (Object.prototype.hasOwnProperty.call(searchCriteria, key)) {
                const value = searchCriteria[key];
                if (Array.isArray(value)) {
                    value.forEach(item => params.append(key, item));
                } else if (value !== null && value !== undefined && value !== '') {
                    params.append(key, value);
                }
            }
        }
    }

    params.append('page', page.toString());
    params.append('size', size.toString());
    if (sort && sort.trim() !== '') {
        params.append('sort', sort);
    }

    console.log('API searchUsers - Final Query Params being sent to backend:', params.toString());
    return request(`/users/search/filter?${params.toString()}`, 'GET');
};

export const getMatches = (page = 0, size = 10, sort = '') => {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });
    if (sort) params.append('sort', sort);
    return request(`/users/matches?${params.toString()}`, 'GET');
};

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

// --- Project Service API Calls ---
export const getOwnedProjects = (page = 0, size = 10, sort = 'title,asc') => request(`/projects/owned?page=${page}&size=${size}&sort=${sort}`, 'GET');
export const getCollaboratingProjects = (page = 0, size = 10, sort = 'title,asc') => request(`/projects/collaborating?page=${page}&size=${size}&sort=${sort}`, 'GET');
export const createProject = (projectData) => request('/projects', 'POST', projectData);
export const getProjectById = (projectId) => request(`/projects/${projectId}`, 'GET');
export const deleteProjectApi = (projectId) => request(`/projects/${projectId}`, 'DELETE');

// --- Tasks ---
export const getProjectTasks = (projectId, page = 0, size = 10, sort = 'createdAt,asc') => request(`/projects/${projectId}/tasks?page=${page}&size=${size}&sort=${sort}`, 'GET');

// --- Milestones ---
export const getProjectMilestones = (projectId, page = 0, size = 10, sort = 'dueDate,asc') => request(`/projects/${projectId}/milestones?page=${page}&size=${size}&sort=${sort}`, 'GET');

// --- Files ---
export const getProjectFiles = (projectId) => request(`/projects/${projectId}/files`, 'GET');
export const uploadProjectFileApi = (projectId, formData) => request(`/projects/${projectId}/files`, 'POST', formData, true);
export const getProjectFileDownloadUrl = (projectId, fileId) => request(`/projects/${projectId}/files/${fileId}/download-url`, 'GET');
export const getAllVersionsOfFile = (projectId, originalFilename) => request(`/projects/${projectId}/files/versions?filename=${encodeURIComponent(originalFilename)}`, 'GET');
export const deleteProjectFileApi = (projectId, fileId) => request(`/projects/${projectId}/files/${fileId}`, 'DELETE');

// --- Collaborators ---
export const getProjectCollaborators = (projectId, page = 0, size = 10, sort = '') => request(`/projects/${projectId}/collaborators?page=${page}&size=${size}&sort=${sort}`, 'GET');

// --- Budget ---
export const getProjectBudget = (projectId) => request(`/projects/${projectId}/budget`, 'GET');
export const getRemainingProjectBudget = (projectId) => request(`/projects/${projectId}/budget/remaining`, 'GET');
export const createProjectBudgetApi = (projectId, budgetData) => request(`/projects/${projectId}/budget`, 'POST', budgetData);