import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Alert,
    CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { recipeService } from '../services/api';
import { Recipe } from '../services/api';

const EditRecipe: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        cookingTime: '',
        servings: '',
        imageUrl: ''
    });

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                if (!id) return;
                const response = await recipeService.getById(parseInt(id));
                const recipeData = response.data;
                setRecipe(recipeData);
                setFormData({
                    title: recipeData.title,
                    description: recipeData.description,
                    ingredients: recipeData.ingredients,
                    instructions: recipeData.instructions,
                    cookingTime: recipeData.cookingTime.toString(),
                    servings: recipeData.servings.toString(),
                    imageUrl: recipeData.imageUrl || ''
                });
            } catch (error) {
                console.error('Tarif yüklenirken hata oluştu:', error);
                setError('Tarif yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setSaving(true);

        try {
            if (!id) return;

            const recipeData = {
                title: formData.title,
                description: formData.description,
                ingredients: formData.ingredients,
                instructions: formData.instructions,
                cookingTime: parseInt(formData.cookingTime),
                servings: parseInt(formData.servings),
                imageUrl: formData.imageUrl || null,
                userId: recipe?.user.id || 0
            };

            await recipeService.update(parseInt(id), recipeData);
            setSuccess('Tarif başarıyla güncellendi');
            
            // 2 saniye sonra tariflerim sayfasına yönlendir
            setTimeout(() => {
                navigate('/my-recipes');
            }, 2000);
        } catch (error) {
            console.error('Tarif güncellenirken hata oluştu:', error);
            setError('Tarif güncellenirken bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#ddc189', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#5a6604' }}>
                        Tarifi Düzenle
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Tarif Adı"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Açıklama"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={5}
                                    label="Malzemeler"
                                    name="ingredients"
                                    value={formData.ingredients}
                                    onChange={handleChange}
                                    placeholder="Her malzemeyi yeni satıra yazın"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={5}
                                    label="Hazırlanışı"
                                    name="instructions"
                                    value={formData.instructions}
                                    onChange={handleChange}
                                    placeholder="Her adımı yeni satıra yazın"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    type="number"
                                    label="Pişirme Süresi (dakika)"
                                    name="cookingTime"
                                    value={formData.cookingTime}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    type="number"
                                    label="Kaç Kişilik"
                                    name="servings"
                                    value={formData.servings}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Resim URL"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    placeholder="Tarif resminin URL'sini girin"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/my-recipes')}
                                        disabled={saving}
                                    >
                                        İptal
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={saving}
                                        sx={{
                                            bgcolor: '#5a6604',
                                            '&:hover': {
                                                bgcolor: '#4a5503'
                                            }
                                        }}
                                    >
                                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default EditRecipe; 