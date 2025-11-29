import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const api = {
    getProducts: () => axios.get(`${API_URL}/products`).then(res => res.data),

    getCart: (userId: string) => axios.get(`${API_URL}/cart/${userId}`).then(res => res.data),

    addToCart: (userId: string, productId: string) =>
        axios.post(`${API_URL}/cart/add`, { userId, productId }),

    checkout: (userId: string, code?: string) =>
        axios.post(`${API_URL}/checkout`, { userId, discountCode: code }),


};
