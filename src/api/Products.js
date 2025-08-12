import axios from 'axios';

const productsApi = axios.create({
    baseURL: 'http://127.0.0.1:8000/products/api/products',
});

const imageApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/products/api'
});

export const getProducts = () => productsApi.get('/');

export const getProduct = (id) => productsApi.get(`/${id}/`);

export const createProduct = (productData) => productsApi.post('/', productData);

export const deleteProduct = (id) => productsApi.delete(`/${id}/`);

export const updateProduct = (id, productData) => productsApi.put(`/${id}/`, productData);

export const uploadImage = (formData) => {
  return imageApi.post('/images/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteImage = (id) => {
  return imageApi.delete(`/images/${id}/`);
};