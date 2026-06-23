import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "@/constants";

export const getProducts = async (limit = 100) => {
  const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS, {
    params: { limit },
  });
  return response.data;
};

export const searchProducts = async (query) => {
  const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS_SEARCH, {
    params: { q: query },
  });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
  return response.data;
};
