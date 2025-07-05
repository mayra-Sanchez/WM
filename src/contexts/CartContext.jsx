import { createContext, useContext, useEffect, useState } from "react";
import {
    getCartItems,
    addToCart,
    updateCartItem,
    removeCartItem,
    getCart,
} from "../api/Cart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = async () => {
        try {
            const res = await getCart();
            setCartItems(res.data.items);
        } catch (err) {
            console.error("Error al obtener el carrito:", err);
            setCartItems([]);
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const addItem = async ({ variant, size, quantity }) => {
        try {
            const payload = {
                variant_id: variant,
                size_id: size,
                quantity,
            };

            console.log("Datos corregidos:", payload);

            await addToCart(payload);
            fetchCart();
        } catch (error) {
            console.error("Error al agregar al carrito:", error.response?.data || error);
        }
    };

    const updateItem = async (itemId, updatedData) => {
        try {
            await updateCartItem(itemId, updatedData);
            fetchCart();
        } catch (err) {
            console.error("Error al actualizar ítem:", err);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await removeCartItem(itemId);
            fetchCart();
        } catch (err) {
            console.error("Error al eliminar ítem:", err);
        }
    };

    // Cargar el carrito solo si hay token
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) fetchCart();
    }, []);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                fetchCart,
                addItem,
                updateItem,
                removeItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
