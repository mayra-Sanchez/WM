import axios from "axios";

const authApi = axios.create({
    baseURL: 'http://127.0.0.1:8000/users/api/',
});

export const registerUser = (userData) => authApi.post('register/', userData);

export const loginUser = (credentials) => authApi.post('login/', credentials);