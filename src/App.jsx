import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

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
                {/* This outer Box should be full width and at least full height */}
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}> {/* Explicitly add width: '100%' here too */}
                    <Navbar />
                    {/* This main content Box should grow to fill available space and be full width */}
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1, // Takes up available vertical space
                            py: 3,       // Vertical padding
                            px: 2,       // Horizontal padding
                            width: '100%', // Ensure it tries to be full width of its parent
                            display: 'flex', // Added to help center the Container from HomePage if needed
                            flexDirection: 'column', // Stack children vertically (like HomePage)
                            // alignItems: 'center' // Remove this if HomePage's Container should span full width before centering
                        }}
                    >
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            {/* Other routes */}
                        </Routes>
                    </Box>
                </Box>
            </ThemeProvider>
        </Router>
    );
}

export default App;