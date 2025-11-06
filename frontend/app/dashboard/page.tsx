
"use client"

import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { pageTree } from "@/app/utils/page-tree"

export default function Dashboard() {
    const { data: session } = useSession()

    return (
        <>
            <div className="px-4">
                <h1 className="text-2xl font-semibold">Olá,{session?.user?.name}</h1>
                <p className="text-sm text-gray-500">Bora vender!</p>

                <div className="flex justify-start items-center gap-2 p-2 rounded-md my-5 mb-10 border border-gray-200 shadow-md">
                    <Image
                        src={session?.user?.image || "/avatar.png"}
                        alt="Avatar"
                        width={55}
                        height={55}
                        className="rounded-full shadow-md border border-gray-400"
                    />

                    <div className="px-2">
                        <h2 className="text-xl font-semibold">Store Name</h2>
                        <Link
                            className="w-full text-sm text-blue-400 font-medium"
                            href={"/store/bananashop"}
                        >
                            Ver minha loja
                        </Link>
                    </div>
                </div>

                <div className="my-4">
                    <h2 className="text-xl font-semibold my-4">Dashboard</h2>
                    <div>
                        <div
                            className="flex justify-start items-end gap-2 p-4 h-32 rounded-md border border-gray-300 shadow-md"
                        >
                            <div>
                                <p className="text-md text-gray-500">Saldo em vendas</p>
                                <h3 className="text-3xl font-semibold">R$00,00</h3>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 my-4">
                            <div
                                className="flexjustify-start items-end gap-2 p-4 h-32 rounded-md border border-gray-300 shadow-md"
                            >

                                <h2 className="text-3xl py-1 font-semibold">20</h2>
                                <h3 className="text-xl font-semibold">R$00,00</h3>
                                <p className="text-md text-gray-500">Vendas Aprovadas</p>
                            </div>
                            <div
                                className="flexjustify-start items-end gap-2 p-4 h-32 rounded-md border border-gray-300 shadow-md"
                            >

                                <h2 className="text-3xl py-1 font-semibold">10</h2>
                                <h3 className="text-xl font-semibold">R$00,00</h3>
                                <p className="text-md text-gray-500">Vendas Pendentes</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold">Menu</h2>
                    <div className="grid grid-cols-2 gap-2 my-4">
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
        </>
    )
}