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

export function getUser(id: string) {
    return axios.get(`${BASE_URL}/user/${id}`);
}

export function updateUser(id: string, user: UpdateUser) {
    return axios.put(`${BASE_URL}/user/${id}`, user);
}