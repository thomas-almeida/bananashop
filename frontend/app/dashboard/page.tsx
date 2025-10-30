
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
                <h1 className="text-2xl font-semibold">Olá {session?.user?.name}</h1>

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
                            href={"/dashboard"}
                        >
                            Ver minha loja
                        </Link>
                    </div>
                </div>

                <div className="my-4">
                    <h2 className="text-xl font-semibold">Dashboard</h2>
                    <div className="grid grid-cols-2 gap-2 my-4">
                        {
                            pageTree.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flexjustify-start items-end gap-2 p-4 h-32 rounded-md border border-gray-300 shadow-md"
                                >
                                    <item.icon />
                                    {item.name}
                                </Link>
                            ))
                        }
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