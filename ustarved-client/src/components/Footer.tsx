import React from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import { Email as EmailIcon, Facebook as FacebookIcon, Instagram as InstagramIcon, Twitter as TwitterIcon } from '@mui/icons-material';

const Footer: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#5a6604',
                color: '#ffffff',
                py: 4,
                mt: 'auto',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #ddc189 0%, #f5e4c0 50%, #ddc189 100%)'
                }
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        position: 'relative'
                    }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        flex: 1,
                        justifyContent: 'flex-start'
                    }}>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 700,
                            color: '#b8c848'
                        }}>
                            uStarved
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            ©2025 ustarved.com
                        </Typography>
                    </Box>

                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}>
                        <Link
                            href="mailto:ustarved@info.com"
                            sx={{
                                color: '#ffffff',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontSize: '1rem',
                                '&:hover': {
                                    color: '#ddc189',
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.2s'
                                }
                            }}
                        >
                            <EmailIcon sx={{ fontSize: '1.2rem' }} />
                            ustarved@info.com
                        </Link>
                    </Box>

                    <Box sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'flex-end'
                    }}>
                        <IconButton
                            size="small"
                            sx={{
                                color: '#ffffff',
                                '&:hover': {
                                    color: '#ddc189',
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.2s'
                                }
                            }}
                        >
                            <FacebookIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            sx={{
                                color: '#ffffff',
                                '&:hover': {
                                    color: '#ddc189',
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.2s'
                                }
                            }}
                        >
                            <InstagramIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            sx={{
                                color: '#ffffff',
                                '&:hover': {
                                    color: '#ddc189',
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.2s'
                                }
                            }}
                        >
                            <TwitterIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Box
                    sx={{
                        mt: 3,
                        pt: 2,
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Tüm hakları saklıdır.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer; 