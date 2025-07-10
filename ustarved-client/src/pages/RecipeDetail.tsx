import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Chip,
    Button,
    Divider,
    Avatar,
    IconButton
} from '@mui/material';
import {
    AccessTime as AccessTimeIcon,
    Restaurant as RestaurantIcon,
    Person as PersonIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { recipeService } from '../services/api';
import { Recipe } from '../services/api';

const RecipeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                if (!id) return;
                const response = await recipeService.getById(parseInt(id));
                setRecipe(response.data);
            } catch (error) {
                console.error('Tarif yüklenirken hata oluştu:', error);
                setError('Tarif yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography>Yükleniyor...</Typography>
            </Container>
        );
    }

    if (error || !recipe) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography color="error">{error || 'Tarif bulunamadı'}</Typography>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                    sx={{ mt: 2 }}
                >
                    Ana Sayfaya Dön
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: '#ddc189', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                    sx={{ mb: 4 }}
                >
                    Geri Dön
                </Button>

                <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Box
                                component="img"
                                src={recipe.imageUrl || '/default-recipe.jpg'}
                                alt={recipe.title}
                                sx={{
                                    width: '100%',
                                    height: '400px',
                                    objectFit: 'cover',
                                    borderRadius: 2
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h4" gutterBottom>
                                {recipe.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PersonIcon sx={{ mr: 1 }} />
                                <Typography variant="body1">
                                    {recipe.user.email}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <Chip
                                    icon={<AccessTimeIcon />}
                                    label={`${recipe.cookingTime} dakika`}
                                />
                                <Chip
                                    icon={<RestaurantIcon />}
                                    label={`${recipe.servings} kişilik`}
                                />
                            </Box>
                            <Typography variant="body1" paragraph>
                                {recipe.description}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 4 }}>
                            <Typography variant="h5" gutterBottom>
                                Malzemeler
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                {recipe.ingredients}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 4 }}>
                            <Typography variant="h5" gutterBottom>
                                Hazırlanışı
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                {recipe.instructions}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default RecipeDetail; 