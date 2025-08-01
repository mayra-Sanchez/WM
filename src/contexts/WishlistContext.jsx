import { createContext, useContext, useEffect, useState } from "react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/Wishlist";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const res = await getWishlist();
        setWishlist(res.data);
      } catch (error) {
        console.error("Error al cargar wishlist:", error);
      }
    };

    loadWishlist();
  }, []);

  const add = async (productId) => {
    try {
      const res = await addToWishlist(productId);
      setWishlist((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error al agregar a wishlist:", error);
    }
  };

  const remove = async (wishlistId) => {
    try {
      await removeFromWishlist(wishlistId);
      setWishlist((prev) => prev.filter((item) => item.id !== wishlistId));
    } catch (error) {
      console.error("Error al eliminar de wishlist:", error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, add, remove }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);