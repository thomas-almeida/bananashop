'use client'

import { useState, useEffect } from "react"
import { getProductsByStore } from "@/app/service/productService"

export function useProducts() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchProducts = async () => {
        setLoading(true);
        const userData = localStorage.getItem("userStore")

        try {
            if (userData) {
                const parsedUser = JSON.parse(userData)
                const storeId = parsedUser?.store

                if (storeId) {
                    const response = await getProductsByStore(storeId);
                    setProducts(response);
                }
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error; // Lança o erro para que possa ser tratado por quem chamar refetch
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [])

    // Função para forçar a atualização dos dados
    const refetch = async () => {
        try {
            await fetchProducts();
        } catch (error) {
            console.error('Error during refetch:', error);
            throw error;
        }
    };

    return { products, loading, refetch }
}