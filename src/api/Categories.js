import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const categoriesApi = axios.create({
    baseURL: `${baseURL}/products/api/categories`,
});

export const getCategories = () => categoriesApi.get('/');

export const getCategory = (id) => categoriesApi.get(`/${id}/`);

export const createCategory = (categoryData) => categoriesApi.post('/', categoryData);

export const deleteCategory = (id) => categoriesApi.delete(`/${id}/`);

export const updateCategory = (id, categoryData) => categoriesApi.put(`/${id}/`, categoryData);