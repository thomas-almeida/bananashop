import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASEURL;

interface CreateTransactionData {
  productId: string;
  quantity: number;
  value: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export interface TransactionData {
  _id: string;
  productId: string;
  store: string;
  quantity: number;
  value: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export const createTransaction = async (data: CreateTransactionData) => {
  const response = await axios.post(`${BASE_URL}/transaction`, data);
  return response.data;
};

export const updateBalance = async (storeId: string, transactionId: string) => {
  const response = await axios.put(`${BASE_URL}/transaction/balance`, { storeId, transactionId });
  return response.data;
}

export const getTransactionById = async (transactionId: string) => {
  const response = await axios.get(`${BASE_URL}/transaction/${transactionId}`);
  return response.data as TransactionData;
}