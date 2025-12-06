'use client'

import { useCallback, useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { getUser } from "@/app/service/userService";

type User = {
    banking: {
        balance: number;
        pixKey: string;
        rate: number;
        taxId: string;
    },
    username: string;
    email: string;
    store: string;
    _id: string;
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    const fetchUser = useCallback(async () => {
        const userId = session?.user?.id;

        if (!userId) {
            setLoading(false);
            return null;
        }

        setLoading(true);
        try {
            const userData = await getUser(userId);
            localStorage.setItem("userStore", JSON.stringify(userData));
            setUser(userData);
            return userData;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [session?.user?.id]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const refetch = useCallback(async () => {
        return fetchUser();
    }, [fetchUser]);

    return { user, loading, refetch };
}