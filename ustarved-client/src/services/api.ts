import axios from 'axios';

interface LoginResponse {
    message: string;
    userId: number;
    email: string;
}

interface RegisterResponse {
    message: string;
}

interface RecipeCreateModel {
    title: string;
    description: string;
    ingredients: string;
    instructions: string;
    cookingTime: number;
    servings: number;
    imageUrl: string | null;
    userId: number;
}

interface Recipe {
    id: number;
    title: string;
    description: string;
    ingredients: string;
    instructions: string;
    cookingTime: number;
    servings: number;
    imageUrl: string | null;
    createdAt: string;
    user: {
        id: number;
        email: string;
    };
}

const api = axios.create({
    baseURL: 'http://localhost:5244/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email: string, password: string) => {
        return api.post<LoginResponse>('/auth/login', { email, password });
    },
    register: async (email: string, password: string) => {
        return api.post<RegisterResponse>('/auth/register', { email, password });
    }
};

export const recipeService = {
    getAll: async () => {
        return api.get<Recipe[]>('/recipes');
    },
    getById: async (id: number) => {
        return api.get<Recipe>(`/recipes/${id}`);
    },
    create: async (recipe: RecipeCreateModel) => {
        return api.post<Recipe>('/recipes', recipe);
    },
    update: async (id: number, recipe: RecipeCreateModel) => {
        return api.put<Recipe>(`/recipes/${id}`, recipe);
    },
    delete: async (id: number) => {
        return api.delete(`/recipes/${id}`);
    }
};

export type { Recipe, RecipeCreateModel, LoginResponse, RegisterResponse };
export default api; 