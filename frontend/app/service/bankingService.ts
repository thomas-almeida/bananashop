import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASEURL;

export interface BankingData {
    taxID: string;
    pixKey: string;
    rate: "IMEDIATO" | "SEMANAL" | "MENSAL";
}

export const getBankingData = async (userId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/users/${userId}/banking`);
        return response.data;
    } catch (error) {
        console.error('Error fetching banking data:', error);
        throw error;
    }
};

export const updateBankingData = async (userId: string, bankingData: Partial<BankingData>) => {
    try {
        const response = await axios.put(`${BASE_URL}/users/${userId}/banking`, bankingData);
        return response.data;
    } catch (error) {
        console.error('Error updating banking data:', error);
        throw error;
    }
};
