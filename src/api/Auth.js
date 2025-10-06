import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const authApi = axios.create({
    baseURL: `${baseURL}/users/api/`,
});

export const registerUser = (userData) => authApi.post('register/', userData);

export const loginUser = (credentials) => authApi.post('login/', credentials);