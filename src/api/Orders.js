import axios from "axios";

const ordersApi = axios.create({
  baseURL: "https://wmsiteweb.xyz/orders/api/orders/",
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