'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { useShop } from '@/hooks/use-shop';
import SettingsTabs from '../components/SettingsTabs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ConfiguracoesPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { user, loading: userLoading } = useUser();
    const { store, loading: shopLoading } = useShop();

    useEffect(() => {
        // Se não estiver mais carregando, verifica se o usuário tem uma loja
        if (!userLoading) {
            // Se o usuário não tiver uma loja, redireciona para onboarding
            if (user?.store === null) {
                router.push('/onboarding');
            }
        }
    }, [userLoading, user, router]);

    if (userLoading || shopLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    // Se o usuário não tiver uma loja, não renderiza nada (já que será redirecionado)
    if (user?.store === null) {
        return null;
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div>
                <Link
                    href={"/dashboard"}
                    className="flex justify-start items-center mb-5 border border-slate-200 max-w-[100px] p-2 rounded shadow text-lg font-medium gap-2"
                >
                    <ArrowLeft />
                    Voltar
                </Link>
            </div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold">Configurações</h1>
                <p className="text-gray-600">Gerencie as configurações da sua loja e conta</p>
            </div>

            {store && <SettingsTabs storeData={store} user={user} />}
        </div>
    );
}
