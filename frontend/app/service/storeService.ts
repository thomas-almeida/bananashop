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


export const updateStore = async (storeId: string, storeData: any) => {
    try {
        const response = await axios.put(`${BASE_URL}/stores/${storeId}/update`, storeData);
        return response.data;
    } catch (error) {
        console.error('Error updating store:', error);
        throw error;
    }
};

export const getStoreByUserId = async (userId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/stores/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting store:', error);
        throw error;
    }
};

export const getStoreById = async (storeId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/stores/by-id/${storeId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting store:', error);
        throw error;
    }
}

export const getStoreByName = async (storeName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/stores/name/${storeName}`);
        return response.data;
    } catch (error) {
        console.error('Error getting store:', error);
        throw error;
    }
};

export interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}

export const searchCep = async (cep: string): Promise<ViaCepResponse> => {
    try {
        // Remove qualquer caractere que não seja número
        const cleanedCep = cep.replace(/\D/g, '');
        
        if (cleanedCep.length !== 8) {
            throw new Error('CEP deve conter 8 dígitos');
        }

        const response = await axios.get(`https://viacep.com.br/ws/${cleanedCep}/json/`);
        
        if (response.data.erro) {
            throw new Error('CEP não encontrado');
        }

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        throw error;
    }
};
