import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASEURL;

interface WithdrawalPayload {
    value: number;
    userId: string;
    storeId: string;
}

interface Withdrawal {
    _id: string;
    value: number;
    userId: string;
    storeId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function createWithdrawal(payload: WithdrawalPayload) {
    const response = await axios.post(`${BASE_URL}/withdraw`, payload);
    return response.data;
}

export async function getWithdrawsByUserId(userId: string) {
    const response = await axios.get(`${BASE_URL}/withdraw/${userId}`);
    return response;
}