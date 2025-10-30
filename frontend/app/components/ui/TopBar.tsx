"use client"

import Image from "next/image"
import { useSession } from "next-auth/react"

export default function TopBar() {
    const { data: session } = useSession()
    return (
        <>
            <div className="p-4 mb-4">
                <div className="flex justify-between items-center text-center text-sm font-medium text-gray-600">
                    <div>
                        <div className="flex justify-start items-center">
                            <h3 className="text-xl font-semibold text-black">BananaShop</h3>
                            <Image
                                src={"/logo.png"}
                                alt="Logo"
                                width={45}
                                height={45}
                                className=""
                            />
                        </div>
                    </div>
                    <div>
                        <Image
                            src={session?.user?.image || "/avatar.png"}
                            alt="Avatar"
                            width={55}
                            height={55}
                            className="rounded-full shadow-md"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}