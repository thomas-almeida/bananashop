import axios from "axios"
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASEURL

export interface createProductPayload {
    name: string;
    price: number;
    description: string;
    brand?: string;
    images: string[];
    inStorage: number;
}

export interface ProductData {
    name: string;
    price: number;
    description: string;
    brand?: string;
    images: string[];
    inStorage: number;
    store: string;
}

export const getProductsByStore = async (storeId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/products/${storeId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getProductById = async (productId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/products/get-product/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

export const createProduct = async (storeId: string, payload: createProductPayload) => {
    try {
        const response = await axios.post(`${BASE_URL}/products/${storeId}/create`, payload);
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

export const searchCustomerPostalCode = async (postalCode: number) => {
    try {
        const response = await axios.get(`viacep.com.br/ws/${postalCode}/json/`, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching customer postal code:', error);
        throw error;
    }
}