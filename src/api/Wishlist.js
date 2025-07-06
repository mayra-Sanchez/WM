import axios from "axios";

const wishlistApi = axios.create({
  baseURL: "http://localhost:8000/wishlist/api/wishlist/",
});

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getWishlist = () => wishlistApi.get("", getAuthHeaders());

export const addToWishlist = (productId) =>
  wishlistApi.post("", { product: productId }, getAuthHeaders());

export const removeFromWishlist = (wishlistId) =>
  wishlistApi.delete(`${wishlistId}/`, getAuthHeaders());
