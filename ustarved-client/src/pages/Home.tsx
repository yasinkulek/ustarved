import React, { useEffect, useState, useRef } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Chip,
    Paper,
    useTheme,
    useMediaQuery,
    Rating,
    Avatar,
    Fade
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Favorite as FavoriteIcon,
    Share as ShareIcon,
    AccessTime as AccessTimeIcon,
    Person as PersonIcon,
    Restaurant as RestaurantIcon,
    Cake as CakeIcon,
    LocalCafe as CoffeeIcon,
    LocalDining as SaladIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recipeService } from '../services/api';
import { Recipe as ApiRecipe } from '../services/api';

interface Recipe {
    id: number;
    title: string;
    ingredients: string;
    steps: string;
    imageUrl: string;
    createdAt: string;
    user: {
        email: string;
    };
}

const Home: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                console.log('Tarifler yükleniyor...');
                const response = await recipeService.getAll();
                console.log('API Yanıtı:', response);
                
                if (response.data) {
                    const mapped = response.data.map((r: any) => ({
                        id: r.id,
                        title: r.title,
                        ingredients: r.ingredients,
                        steps: r.instructions,
                        imageUrl: r.imageUrl,
                        createdAt: r.createdAt,
                        user: {
                            email: r.user?.email || 'Anonim'
                        }
                    }));
                    console.log('Dönüştürülmüş tarifler:', mapped);
                    setRecipes(mapped);
                } else {
                    console.error('API yanıtında veri yok');
                }
            } catch (error) {
                console.error('Tarifler yüklenirken hata oluştu:', error);
            }
        };
        fetchRecipes();
    }, []);

    const filteredRecipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Arama işlemi burada yapılacak
        console.log('Arama:', searchQuery);
    };

    // Arama kutusu dışına tıklanınca kapat
    useEffect(() => {
        if (!isSearchOpen) return;
        function handleClickOutside(event: MouseEvent) {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchOpen]);

    // openSearch ve closeSearch fonksiyonlarını sadeleştir
    const openSearch = () => {
        setIsSearchOpen(true);
    };
    const closeSearch = () => {
        setIsSearchOpen(false);
    };

    return (
        <Box sx={{ bgcolor: '#ddc189', minHeight: '100vh' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    height: '300px',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(rgba(90, 102, 4, 0.8), rgba(90, 102, 4, 0.9))',
                        zIndex: 1
                    }
                }}
            >
                <Box
                    component="img"
                    src="/hero-image.jpg"
                    alt="Hero Background"
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'blur(2px)'
                    }}
                />
                <Container
                    maxWidth="lg"
                    sx={{
                        position: 'relative',
                        zIndex: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                >
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h1"
                                sx={{
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    mb: 2,
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                                }}
                            >
                                Lezzetli Tarifler
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: '#ffffff',
                                    mb: 4,
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                                }}
                            >
                                En lezzetli tarifleri keşfedin ve kendi tariflerinizi paylaşın
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate('/create-recipe')}
                                    sx={{
                                        bgcolor: '#ddc189',
                                        color: '#000000',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        '&:hover': {
                                            bgcolor: '#f5e4c0',
                                        }
                                    }}
                                >
                                    Tarif Oluştur
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Search Section */}
            <Container maxWidth="lg" sx={{ mt: -4, mb: 4, position: 'relative', zIndex: 3 }}>
                <Box sx={{ 
                    width: '100%', 
                    maxWidth: '600px', 
                    mx: 'auto',
                    position: 'relative',
                    mt: 1.5,
                    height: '56px',
                }}>
                    {/* Buton ve arama kutusu aynı anda DOM'da, üst üste */}
                    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '56px', zIndex: 2, transition: 'opacity 0.3s', opacity: isSearchOpen ? 0 : 1, pointerEvents: isSearchOpen ? 'none' : 'auto' }}>
                        <Button
                            variant="contained"
                            onClick={openSearch}
                            sx={{
                                width: '100%',
                                height: '56px',
                                bgcolor: '#5a6604',
                                color: '#ffffff',
                                fontSize: '1.2rem',
                                borderRadius: '28px',
                                boxShadow: '0 4px 24px rgba(90,102,4,0.15)',
                                '&:hover': {
                                    bgcolor: '#4a5503',
                                    transform: 'scale(1.02)',
                                    transition: 'all 0.3s ease'
                                }
                            }}
                        >
                            <SearchIcon sx={{ mr: 1 }} />
                            Ne yemek istersin?
                        </Button>
                    </Box>
                    <Box
                        ref={searchBoxRef}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '56px',
                            display: 'flex',
                            alignItems: 'center',
                            zIndex: 3,
                            pointerEvents: isSearchOpen ? 'auto' : 'none',
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                transformOrigin: 'center',
                                transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
                                transform: isSearchOpen ? 'scaleX(1)' : 'scaleX(0)',
                            }}
                        >
                            <Box
                                component="form"
                                onSubmit={handleSearch}
                                sx={{
                                    width: '100%',
                                    bgcolor: '#5a6604',
                                    borderRadius: '28px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 24px rgba(90,102,4,0.15)',
                                    p: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Tarif ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: '#b8c848',
                                            borderRadius: 0,
                                            boxShadow: 'none',
                                            '& fieldset': {
                                                border: 'none',
                                                borderRadius: 0,
                                            },
                                            '&:hover fieldset': {
                                                border: 'none',
                                            },
                                            '&.Mui-focused fieldset': {
                                                border: 'none',
                                            },
                                            '& input': {
                                                color: '#5a6604',
                                                fontWeight: 500,
                                                '&::placeholder': {
                                                    color: '#5a6604',
                                                    opacity: 0.7
                                                }
                                            }
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton 
                                                    type="submit"
                                                    sx={{ 
                                                        color: '#5a6604',
                                                        '&:hover': {
                                                            color: '#4a5503'
                                                        }
                                                    }}
                                                >
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>

            {/* Categories Section */}
            <Container maxWidth="lg" sx={{ mb: 6, bgcolor: '#ddc189!important', py: 0 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                bgcolor: '#ddc189',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    bgcolor: '#5a6604',
                                    '& .MuiSvgIcon-root': {
                                        color: 'white',
                                        transform: 'scale(0.8)'
                                    },
                                    '& .category-name': {
                                        opacity: 1,
                                        transform: 'translateY(0)'
                                    }
                                }
                            }}
                        >
                            <RestaurantIcon sx={{ fontSize: 60, mb: 2, color: '#5a6604', transition: 'all 0.3s ease' }} />
                            <Typography 
                                variant="h6" 
                                className="category-name"
                                sx={{ 
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    bgcolor: 'rgba(90, 102, 4, 0.9)',
                                    color: 'white',
                                    py: 1,
                                    opacity: 0,
                                    transform: 'translateY(100%)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Yemekler
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                bgcolor: '#ddc189',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    bgcolor: '#5a6604',
                                    '& .MuiSvgIcon-root': {
                                        color: 'white',
                                        transform: 'scale(0.8)'
                                    },
                                    '& .category-name': {
                                        opacity: 1,
                                        transform: 'translateY(0)'
                                    }
                                }
                            }}
                        >
                            <CakeIcon sx={{ fontSize: 60, mb: 2, color: '#5a6604', transition: 'all 0.3s ease' }} />
                            <Typography 
                                variant="h6" 
                                className="category-name"
                                sx={{ 
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    bgcolor: 'rgba(90, 102, 4, 0.9)',
                                    color: 'white',
                                    py: 1,
                                    opacity: 0,
                                    transform: 'translateY(100%)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Tatlılar
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                bgcolor: '#ddc189',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    bgcolor: '#5a6604',
                                    '& .MuiSvgIcon-root': {
                                        color: 'white',
                                        transform: 'scale(0.8)'
                                    },
                                    '& .category-name': {
                                        opacity: 1,
                                        transform: 'translateY(0)'
                                    }
                                }
                            }}
                        >
                            <CoffeeIcon sx={{ fontSize: 60, mb: 2, color: '#5a6604', transition: 'all 0.3s ease' }} />
                            <Typography 
                                variant="h6" 
                                className="category-name"
                                sx={{ 
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    bgcolor: 'rgba(90, 102, 4, 0.9)',
                                    color: 'white',
                                    py: 1,
                                    opacity: 0,
                                    transform: 'translateY(100%)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                İçecekler
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                bgcolor: '#ddc189',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    bgcolor: '#5a6604',
                                    '& .MuiSvgIcon-root': {
                                        color: 'white',
                                        transform: 'scale(0.8)'
                                    },
                                    '& .category-name': {
                                        opacity: 1,
                                        transform: 'translateY(0)'
                                    }
                                }
                            }}
                        >
                            <SaladIcon sx={{ fontSize: 60, mb: 2, color: '#5a6604', transition: 'all 0.3s ease' }} />
                            <Typography 
                                variant="h6" 
                                className="category-name"
                                sx={{ 
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    bgcolor: 'rgba(90, 102, 4, 0.9)',
                                    color: 'white',
                                    py: 1,
                                    opacity: 0,
                                    transform: 'translateY(100%)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Salatalar
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Recipes Grid */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={4}>
                    {filteredRecipes.map((recipe) => (
                        <Grid item key={recipe.id} xs={12} sm={6} md={4}>
                            <Card 
                                sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: 6
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={recipe.imageUrl || '/default-recipe.jpg'}
                                    alt={recipe.title}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {recipe.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {recipe.ingredients.split('\n').slice(0, 3).join(', ')}...
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {recipe.user.email}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AccessTimeIcon sx={{ mr: 1, fontSize: 20 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(recipe.createdAt).toLocaleDateString('tr-TR')}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <Box sx={{ p: 2, pt: 0 }}>
                                    <Button 
                                        fullWidth 
                                        variant="outlined"
                                        onClick={() => navigate(`/recipe/${recipe.id}`)}
                                    >
                                        Tarifi Görüntüle
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Call to Action */}
            {!isAuthenticated && (
                <Container maxWidth="md" sx={{ my: 8 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 6,
                            textAlign: 'center',
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #5a6604 0%, #7a8514 100%)',
                            color: 'white',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}
                    >
                        <RestaurantIcon sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                            Hemen Katılın!
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                            Kendi tariflerinizi paylaşın ve diğer şeflerin tariflerini keşfedin.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/register')}
                                sx={{
                                    bgcolor: '#ddc189',
                                    color: '#000000',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    '&:hover': {
                                        bgcolor: '#f5e4c0',
                                    }
                                }}
                            >
                                Kayıt Ol
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/login')}
                                sx={{
                                    borderColor: '#ffffff',
                                    color: '#ffffff',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    '&:hover': {
                                        borderColor: '#ddc189',
                                        color: '#ddc189',
                                        bgcolor: 'rgba(255,255,255,0.1)'
                                    }
                                }}
                            >
                                Giriş Yap
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            )}
        </Box>
    );
};

export default Home; 