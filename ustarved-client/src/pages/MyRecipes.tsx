import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    IconButton,
    Paper
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recipeService } from '../services/api';
import { Recipe } from '../services/api';

const MyRecipes: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyRecipes = async () => {
            try {
                console.log('Tariflerim yükleniyor...');
                const response = await recipeService.getAll();
                console.log('API Yanıtı:', response);
                
                if (response.data && user) {
                    // Sadece kullanıcının kendi tariflerini filtrele
                    const myRecipes = response.data.filter((recipe: any) => 
                        recipe.user?.id === user.id
                    );
                    console.log('Benim tariflerim:', myRecipes);
                    setRecipes(myRecipes);
                }
            } catch (error) {
                console.error('Tariflerim yüklenirken hata oluştu:', error);
            }
        };

        if (user) {
            fetchMyRecipes();
        }
    }, [user]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Bu tarifi silmek istediğinizden emin misiniz?')) {
            try {
                await recipeService.delete(id);
                setRecipes(recipes.filter(recipe => recipe.id !== id));
            } catch (error) {
                console.error('Tarif silinirken hata oluştu:', error);
            }
        }
    };

    return (
        <Box sx={{ bgcolor: '#ddc189', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ color: '#5a6604' }}>
                        Tariflerim
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/create-recipe')}
                        sx={{
                            bgcolor: '#5a6604',
                            '&:hover': {
                                bgcolor: '#4a5503'
                            }
                        }}
                    >
                        Yeni Tarif Ekle
                    </Button>
                </Box>

                {recipes.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Henüz hiç tarif eklememişsiniz
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/create-recipe')}
                            sx={{
                                mt: 2,
                                bgcolor: '#5a6604',
                                '&:hover': {
                                    bgcolor: '#4a5503'
                                }
                            }}
                        >
                            İlk Tarifini Ekle
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={4}>
                        {recipes.map((recipe) => (
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
                                            {recipe.description}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(recipe.createdAt).toLocaleDateString('tr-TR')}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                                        <Button 
                                            fullWidth 
                                            variant="outlined"
                                            onClick={() => navigate(`/recipe/${recipe.id}`)}
                                        >
                                            Görüntüle
                                        </Button>
                                        <IconButton 
                                            color="primary"
                                            onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            color="error"
                                            onClick={() => handleDelete(recipe.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default MyRecipes; 