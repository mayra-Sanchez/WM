import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const ordersApi = axios.create({
  baseURL: `${baseURL}/orders/api/orders/`,
});

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createOrder = (data) =>
  ordersApi.post("checkout/", data, getAuthHeaders());

export const getOrders = () =>
  ordersApi.get("", getAuthHeaders());

export const getOrderDetail = (orderId) =>
  ordersApi.get(`${orderId}/`, getAuthHeaders());

export const updateOrderStatus = (orderId, status) => {
  ordersApi.patch(`${orderId}/`, { status }, getAuthHeaders())
};