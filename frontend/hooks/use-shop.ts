'use client'

import { useState, useEffect } from "react"
import { getStoreByUserId, getStoreByName } from "@/app/service/storeService";
import { useSession } from "next-auth/react";

type Store = {
    name: string;
    description: string;
    image: string;
    publicLink: string;
    igNickname: string;
    whatsappNumber: string;
    views: number;
    products: any[];
}

export function useShop(storeId?: string) {

    const [store, setStore] = useState<Store | null>(null)
    const [loading, setLoading] = useState(true)
    const [publicStore, setPublicStore] = useState<Store | null>(null)
    const { data: session } = useSession()

    useEffect(() => {
        async function fetchStore() {
            const userId = session?.user.id

            if (!userId) {
                setLoading(false)
                return
            }

            try {
                const storeData = await getStoreByUserId(userId)
                setStore(storeData)
            } catch (error) {
                console.error('Error fetching store', error);
                setLoading(false);
            } finally {
                setLoading(false)
            }
        }

        async function fetchStoreByName() {
            try {
                if (storeId) {
                    const storeData = await getStoreByName(storeId);
                    setPublicStore(storeData?.data);
                }
            } catch (error) {
                console.error('Error fetching public store', error);
            }
        }

        fetchStore();

        if (storeId) {
            fetchStoreByName();
        }
    }, [session, storeId])

    return { store, loading, publicStore };
}