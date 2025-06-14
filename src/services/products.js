import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export const getAllProducts = async () => {
  const res = await axios.get(`${API_BASE_URL}/products/`);
  return res.data;
};

export const getAllCategories = async () => {
  const res = await axios.get(`${API_BASE_URL}/categories/`);
  return res.data;
};
