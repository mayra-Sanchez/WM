import axios from "axios";

const authApi = axios.create({
    baseURL: 'http://localhost:8000/users/api/',
});

export const registerUser = (userData) => authApi.post('register/', userData);

export const loginUser = (credentials) => authApi.post('login/', credentials);