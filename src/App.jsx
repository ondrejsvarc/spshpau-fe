import React from 'react'; // Import React (though not strictly necessary in new JSX transform)
import Button from '@mui/material/Button'; // Import an MUI Button
import Typography from '@mui/material/Typography'; // For text styling
import Container from '@mui/material/Container'; // For layout
import Box from '@mui/material/Box';             // For general layout and spacing
import './App.css'; // You can keep this for custom App-level styles if needed

function App() {
    return (
        <Container maxWidth="sm"> {/* MUI Container to center content and set max width */}
            <Box
                sx={{ // sx prop allows writing CSS directly as an object, or theme-aware styles
                    my: 4, // margin-top and margin-bottom: 4 * theme.spacing (default 8px) = 32px
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to SPSHPAU Frontend!
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    We will build out pages for each service here.
                </Typography>
                <Button variant="contained" color="primary" onClick={() => alert('MUI Button Clicked!')}>
                    Test MUI Button
                </Button>
            </Box>
        </Container>
    );
}

export default App;