import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

function UserProfilePage() {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log("Would fetch user data for ID:", userId);
                setUserData({ id: userId, username: `user_${userId.substring(0,4)}`, firstName: "Some", lastName: "User" }); // Mock data
            } catch (err) {
                setError(err.message || `Failed to fetch user ${userId}`);
            } finally {
                setLoading(false);
            }
        };
        if (userId) {
            fetchUser();
        }
    }, [userId]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    if (error) return <Container sx={{mt:2}}><Alert severity="error">{error}</Alert></Container>;
    if (!userData) return <Container sx={{mt:2}}><Typography>User not found.</Typography></Container>;

    return (
        <Container maxWidth="md">
            <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
                Profile: {userData.firstName} {userData.lastName} (@{userData.username})
            </Typography>
            <Typography>User ID: {userData.id}</Typography>
        </Container>
    );
}

export default UserProfilePage;