'use client'

import { useState, useEffect } from 'react';
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

    useEffect(() => {
        async function fetchUser() {
            const userId = session?.user?.id;
            const userStorage = localStorage.getItem("userStore");

            if (!userId) {
                setLoading(false);
                return;
            }

            try {

                if (userStorage !== null) {
                    const parsedUser = JSON.parse(userStorage);
                    setUser(parsedUser);
                    setLoading(false);
                    return;
                }

                const userData = await getUser(userId);
                localStorage.setItem("userStore", JSON.stringify(userData));
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [session]);

    return { user, loading };
}