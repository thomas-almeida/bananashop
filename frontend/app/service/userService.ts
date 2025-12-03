import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASEURL;

interface User {
    username: string;
    email: string;
}

interface UpdateUser {
    taxId: string;
    pixKey: string;
    rate: number;
}

export function createUser(user: User) {
    return axios.post(`${BASE_URL}/user`, user);
}

export async function getUser(id: string) {
    const response = await axios.get(`${BASE_URL}/user/${id}`);
    return response.data;
}

export async function updateUser(id: string, user: UpdateUser) {
    const response = await axios.put(`${BASE_URL}/user/${id}`, user);
    return response.data;
}