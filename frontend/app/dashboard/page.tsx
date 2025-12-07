
"use client"

import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { pageTree } from "@/app/utils/page-tree"
import { useUser } from "@/hooks/use-user"
import { useShop } from "@/hooks/use-shop"
import Button from "../components/form/Button"
import { DollarSign, SquareArrowOutUpRight } from "lucide-react"
import WithdrawModal from "../components/modal/WithdrawModal"

export default function Dashboard() {
    const router = useRouter();
    const { data: session } = useSession()
    const { user, loading, refetch } = useUser()
    const { store, loading: shopLoading } = useShop()
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        // Se não estiver mais carregando, verifica se o usuário tem uma loja
        if (!loading) {
            // Se o usuário não tiver uma loja (store === null), redireciona para onboarding
            if (user?.store === null) {
                router.push('/onboarding');
            }
        }
    }, [loading, user, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Se o usuário não tiver uma loja, não renderiza nada (já que será redirecionado)
    if (user?.store === null) {
        return null;
    }

    return (
        <>
            <div className="px-4">
                <h1 className="text-2xl font-semibold">Olá,{session?.user?.name}</h1>
                <p className="text-sm text-gray-500">Bora vender!</p>

                <Link href={`/loja/${store?.normalizedName}`}>
                    <div className="relative flex justify-start items-center gap-2 p-2 rounded-md my-5 mb-10 border border-gray-200 shadow-md">
                        <Image
                            src={store?.image || "/logo.png"}
                            alt="Avatar"
                            width={55}
                            height={55}
                            className="rounded-full shadow-md border border-gray-400 object-cover max-w-[]"
                        />

                        <div className="px-2">
                            <h2 className="text-xl font-semibold">
                                {store?.name}
                            </h2>
                            Clique para ver sua loja
                        </div>

                        <SquareArrowOutUpRight className="absolute top-5 right-4 w-7 h-7 cursor-pointer" />
                    </div>
                </Link>
                <div className="my-4">
                    <h2 className="text-xl font-semibold my-4">Dashboard</h2>
                    <div>
                        <div
                            className="flex justify-start items-end gap-2 p-4 rounded-md border border-gray-300 shadow-md"
                        >
                            <div className="w-full py-2 flex flex-col gap-4">
                                <p className="text-md text-gray-500">Saldo em vendas</p>
                                <h3 className="text-4xl font-semibold">
                                    {user?.banking.balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </h3>
                                <Button
                                    text="Solicitar Saque"
                                    color="primary"
                                    className={`w-full ${!user || user.banking.balance < 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={!user || user.banking.balance < 10}
                                    onClick={() => setModalOpen(true)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold">Menu</h2>
                    <div className="grid grid-cols-1 gap-2 my-4">
                        {
                            pageTree.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex justify-start items-end gap-2 p-4 px-2 h-32 rounded-md border border-gray-300 shadow-md"
                                >
                                    <item.icon />
                                    {item.name}
                                </Link>
                            ))

                        }
                    </div>
                </div>

            </div>
            <WithdrawModal
                isOpen={modalOpen}
                onClose={() => {
                        setModalOpen(false)
                        refetch()
                    }
                }
                user={user}
            />
        </>
    )
}