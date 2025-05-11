import React from 'react';
import { useUser } from '../contexts/UserContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import keycloak from '../keycloak';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
            '&:focus': {
                width: '30ch',
            },
        },
    },
}));


function Navbar() {
    const { appUser, loadingUser, userError, keycloakInitialized, keycloakAuthenticated } = useUser();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleLogout = () => {
        setAnchorEl(null);
        keycloak.logout();
    };

    let displayName = 'User';
    if (appUser) {
        displayName = `${appUser.firstName || ''} ${appUser.lastName || ''}`.trim() || appUser.username;
    } else if (keycloakAuthenticated && keycloak.tokenParsed) {
        displayName = keycloak.tokenParsed.given_name || keycloak.tokenParsed.preferred_username;
    }


    if (!keycloakInitialized || loadingUser) {
        return <AppBar position="static"><Toolbar><Typography>Loading user...</Typography></Toolbar></AppBar>;
    }

    if (userError) {
        console.error("Navbar userError:", userError)
    }


    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    SPSHPAU
                </Typography>

                <Search>
                    <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
                    <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
                </Search>
                <Box sx={{ flexGrow: 1 }} />

                {keycloakAuthenticated ? (
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                            <Typography variant="subtitle1" sx={{ ml: 1 }}>
                                {loadingUser ? 'Loading...' : displayName}
                            </Typography>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <Button color="inherit" onClick={() => keycloak.login()}>
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;