import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    useTheme,
    useMediaQuery,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import {
    Menu as MenuIcon,
    Add as AddIcon,
    Bookmark as BookmarkIcon,
    ExitToApp as LogoutIcon,
    Person as PersonIcon,
    Restaurant as RestaurantIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { keyframes } from '@mui/system';

const bounce = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const Navbar: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLogoAnimating, setIsLogoAnimating] = useState(false);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
        navigate('/');
    };

    const handleLogoClick = () => {
        setIsLogoAnimating(true);
        setTimeout(() => {
            setIsLogoAnimating(false);
            navigate('/');
        }, 300);
    };

    const menuItems = [
        { text: 'Tarif Oluştur', icon: <AddIcon />, path: '/create-recipe' },
        { text: 'Tariflerim', icon: <BookmarkIcon />, path: '/my-recipes' }
    ];

    const drawer = (
        <Box sx={{ width: 250 }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <RestaurantIcon sx={{ color: '#5a6604', fontSize: 30 }} />
                <Typography variant="h6" sx={{ color: '#5a6604', fontWeight: 700 }}>
                    uStarved
                </Typography>
            </Box>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => {
                            navigate(item.path);
                            handleDrawerToggle();
                        }}
                    >
                        <ListItemIcon sx={{ color: '#5a6604' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon sx={{ color: '#5a6604' }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Çıkış Yap" />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <AppBar
            position="static"
            sx={{
                bgcolor: '#ffffff',
                boxShadow: '0 2px 8px 0 rgba(90,102,4,0.10)',
                height: 64,
                justifyContent: 'center',
            }}
        >
            <Toolbar>
                {isMobile && (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, color: '#5a6604' }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        cursor: 'pointer',
                        flexGrow: 1,
                        '&:hover': {
                            '& .logo-icon': {
                                transform: 'rotate(15deg)',
                            }
                        }
                    }}
                    onClick={handleLogoClick}
                >
                    <RestaurantIcon 
                        className="logo-icon"
                        sx={{ 
                            color: '#b8c848',
                            fontSize: 30,
                            transition: 'transform 0.3s ease',
                            animation: isLogoAnimating ? `${bounce} 0.3s ease` : 'none'
                        }} 
                    />
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            color: '#b8c848',
                            fontWeight: 700,
                            display: { xs: 'none', sm: 'block' },
                            animation: isLogoAnimating ? `${bounce} 0.3s ease` : 'none'
                        }}
                    >
                        uStarved
                    </Typography>
                </Box>
                {!isMobile && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {isAuthenticated ? (
                            <>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate('/create-recipe')}
                                    sx={{
                                        bgcolor: '#b8c848',
                                        color: '#245400',
                                        '&:hover': {
                                            bgcolor: '#aeca48',
                                        }
                                    }}
                                >
                                    Tarif Oluştur
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<BookmarkIcon />}
                                    onClick={() => navigate('/my-recipes')}
                                    sx={{
                                        borderColor: '#b8c848',
                                        color: '#b8c848',
                                        '&:hover': {
                                            borderColor: '#aeca48',
                                            color: '#aeca48',
                                            bgcolor: 'rgba(184,200,72,0.08)'
                                        }
                                    }}
                                >
                                    Tariflerim
                                </Button>
                                <IconButton
                                    onClick={handleProfileMenuOpen}
                                    sx={{ color: '#b8c848' }}
                                >
                                    <Avatar sx={{ bgcolor: '#b8c848', color: '#245400', width: 32, height: 32 }}>
                                        <PersonIcon />
                                    </Avatar>
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        borderColor: '#b8c848',
                                        color: '#b8c848',
                                        '&:hover': {
                                            borderColor: '#aeca48',
                                            color: '#aeca48',
                                            bgcolor: 'rgba(184,200,72,0.08)'
                                        }
                                    }}
                                >
                                    Giriş Yap
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/register')}
                                    sx={{
                                        bgcolor: '#b8c848',
                                        color: '#245400',
                                        '&:hover': {
                                            bgcolor: '#aeca48',
                                        }
                                    }}
                                >
                                    Kayıt Ol
                                </Button>
                            </>
                        )}
                    </Box>
                )}
            </Toolbar>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        mt: 1,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        borderRadius: 2
                    }
                }}
            >
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" sx={{ color: '#5a6604' }} />
                    </ListItemIcon>
                    <ListItemText primary="Çıkış Yap" />
                </MenuItem>
            </Menu>
            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true
                }}
                sx={{
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 250
                    }
                }}
            >
                {drawer}
            </Drawer>
        </AppBar>
    );
};

export default Navbar; 