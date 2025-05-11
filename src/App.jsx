import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';

import ArtistProfilePage from './pages/ArtistProfilePage';
import ProducerProfilePage from './pages/ProducerProfilePage';
import CreateArtistProfilePage from './pages/CreateArtistProfilePage';
import CreateProducerProfilePage from './pages/CreateProducerProfilePage';
import MatchesPage from './pages/MatchesPage';
import UserSearchPage from './pages/UserSearchPage';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ProtectedRoute from './components/ProtectedRoute';
import ConnectionsPage from "./pages/ConnectionsPage.jsx";
import BlocksPage from "./pages/BlocksPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";

const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
    },
});

function App() {
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
                    <Navbar />
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            py: 3,
                            px: { xs: 2, sm: 3 },
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/account" element={
                                <ProtectedRoute>
                                    <AccountPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/account/artist-profile" element={
                                <ProtectedRoute><ArtistProfilePage /></ProtectedRoute>
                            } />
                            <Route path="/account/producer-profile" element={
                                <ProtectedRoute><ProducerProfilePage /></ProtectedRoute>
                            } />
                            <Route path="/account/artist-profile/create" element={
                                <ProtectedRoute><CreateArtistProfilePage /></ProtectedRoute>
                            } />
                            <Route path="/account/producer-profile/create" element={
                                <ProtectedRoute><CreateProducerProfilePage /></ProtectedRoute>
                            } />
                            <Route path="/connections" element={
                                <ProtectedRoute><ConnectionsPage /></ProtectedRoute>
                            } />
                            <Route path="/blocks" element={
                                <ProtectedRoute><BlocksPage /></ProtectedRoute>
                            } />
                            <Route path="/users/:userId" element={
                                <ProtectedRoute><UserProfilePage /></ProtectedRoute>
                            } />
                            <Route path="/users/search" element={
                                <ProtectedRoute><UserSearchPage /></ProtectedRoute>
                            } />
                            <Route path="/users/matches" element={
                                <ProtectedRoute><MatchesPage /></ProtectedRoute>
                            } />
                        </Routes>
                    </Box>
                </Box>
            </ThemeProvider>
        </Router>
    );
}

export default App;