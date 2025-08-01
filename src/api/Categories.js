import axios from "axios";

const categoriesApi = axios.create({
    baseURL: 'https://wmsiteweb.xyz/products/api/categories',
});

export const getCategories = () => categoriesApi.get('/');

export const getCategory = (id) => categoriesApi.get(`/${id}/`);

export const createCategory = (categoryData) => categoriesApi.post('/', categoryData);

export const deleteCategory = (id) => categoriesApi.delete(`/${id}/`);

export const updateCategory = (id, categoryData) => categoriesApi.put(`/${id}/`, categoryData);