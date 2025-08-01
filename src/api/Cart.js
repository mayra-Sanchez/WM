import axios from "axios";

const cartApi = axios.create({
    baseURL: 'https://wmsiteweb.xyz/cart/api/',
});

const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getCart = () => cartApi.get('cart/', getAuthHeaders())

export const getCartItems = () => cartApi.get('items/', getAuthHeaders())

export const addToCart = (itemData) => cartApi.post('items/', itemData, getAuthHeaders());

export const updateCartItem = (itemId, updatedData) => cartApi.put(`items/${itemId}/`, updatedData, getAuthHeaders());

export const removeCartItem = (itemId) => cartApi.delete(`items/${itemId}/`, getAuthHeaders());



