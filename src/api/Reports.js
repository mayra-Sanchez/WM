import axios from "axios";

const reportsApi = axios.create({
    baseURL: "http://127.0.0.1:8000/reports/",
})

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


export const getSalesSummary = (startDate, endDate) =>
  reportsApi.get(`sales-summary/?start_date=${startDate}&end_date=${endDate}`, getAuthHeaders());

export const getTopProducts = (startDate, endDate) =>
  reportsApi.get(`top-products/?start_date=${startDate}&end_date=${endDate}`, getAuthHeaders());

export const getOrdersByStatus = (startDate, endDate) =>
  reportsApi.get(`orders-by-status/?start_date=${startDate}&end_date=${endDate}`, getAuthHeaders());

export const getTopCustomers = (startDate, endDate) =>
  reportsApi.get(`top-customers/?start_date=${startDate}&end_date=${endDate}`, getAuthHeaders());

export const getLowStockVariants = (threshold = 5) =>
  reportsApi.get(`low-stock/?threshold=${threshold}`, getAuthHeaders());