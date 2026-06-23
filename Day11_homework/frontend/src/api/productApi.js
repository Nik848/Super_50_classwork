import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "@/constants";

export const getProducts = async (limit = 100) => {
  const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS, {
    params: { limit },
  });
  // The backend now returns { success, message, data: Product[] }
  // And the Product[] now matches the expected format natively!
  return { products: response.data.data };
};

export const searchProducts = async (query) => {
  // We can now use our new dedicated backend search endpoint!
  const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS_SEARCH, {
    params: { q: query },
  });
  return { products: response.data.data };
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
  return response.data.data;
};
