import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASEURL;

export interface StorePayload {
    name: string;
    description: string;
    igNickname: string;
    whatsappNumber: string;
    image?: string;
}

export const createStore = async (userId: string, storeData: StorePayload) => {
    try {
        const response = await axios.post(`${BASE_URL}/stores/${userId}/create`, storeData);
        return response.data;
    } catch (error) {
        console.error('Error creating store:', error);
        throw error;
    }
};


export const updateStore = async (userId: string, storeData: any) => {
    try {
        const response = await axios.put(`${BASE_URL}/stores/${userId}/update`, storeData);
        return response.data;
    } catch (error) {
        console.error('Error updating store:', error);
        throw error;
    }
};