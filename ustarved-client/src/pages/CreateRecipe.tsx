import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { recipeService, RecipeCreateModel } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreateRecipe: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [cookingTime, setCookingTime] = useState<number>(0);
    const [servings, setServings] = useState<number>(1);
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!user) {
                setError('Lütfen önce giriş yapın.');
                return;
            }

            const recipeData: RecipeCreateModel = {
                title,
                description,
                ingredients,
                instructions,
                cookingTime,
                servings,
                imageUrl: imageUrl || null,
                userId: user.id
            };

            await recipeService.create(recipeData);
            navigate('/');
        } catch (err) {
            setError('Tarif oluşturulurken bir hata oluştu.');
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Yeni Tarif Oluştur
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Tarif Başlığı"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Açıklama"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            margin="normal"
                            required
                            multiline
                            rows={2}
                        />
                        <TextField
                            fullWidth
                            label="Malzemeler"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            margin="normal"
                            required
                            multiline
                            rows={4}
                            helperText="Her malzemeyi yeni satıra yazın"
                        />
                        <TextField
                            fullWidth
                            label="Yapılış Adımları"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            margin="normal"
                            required
                            multiline
                            rows={6}
                            helperText="Her adımı yeni satıra yazın"
                        />
                        <TextField
                            fullWidth
                            label="Pişirme Süresi (dakika)"
                            type="number"
                            value={cookingTime}
                            onChange={(e) => setCookingTime(Number(e.target.value))}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Porsiyon Sayısı"
                            type="number"
                            value={servings}
                            onChange={(e) => setServings(Number(e.target.value))}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Resim URL"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            margin="normal"
                            helperText="İsteğe bağlı"
                        />
                        {error && (
                            <Typography color="error" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3 }}
                        >
                            Tarifi Oluştur
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default CreateRecipe; 