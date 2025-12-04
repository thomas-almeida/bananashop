"use client"

import Button from "@/app/components/form/Button";
import { Mail, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useShop } from "@/hooks/use-shop";
import ProductItem from "@/app/components/products/productItem";
import Link from "next/link";

export default function Store() {
    const { storename } = useParams();
    const { publicStore } = useShop(storename as string);

    console.log("Store data:", publicStore);

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-2 p-2 rounded-md">
                <div className="w-[90%]">
                    <div className="flex flex-col items-center gap-2 shadow-md rounded-md border border-gray-300 p-2 py-6">
                        <Image
                            src={publicStore?.image || "/logo.png"}
                            alt="Logo"
                            width={65}
                            height={65}
                            className="rounded-full shadow border border-gray-300"
                        />
                        <div className="px-4 text-center">
                            <h1 className="text-xl font-bold text-black py-1">{storename}</h1>
                            <h2 className="text-md font-medium text-gray-700">@{publicStore?.igNickname}</h2>
                            <p className="text-gray-500 py-3">
                                {publicStore?.description}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 w-[90%] my-2">
                    <Link
                        href={`https://api.whatsapp.com/send?phone=55${publicStore?.whatsappNumber}&text=Olá%2C%20vi%20sua%20loja%20no%20bananashop!%20🍌`}
                        target="_blank"
                    >
                        <Button
                            text="Whatsapp"
                            onClick={() => { }}
                            type="button"
                            color="primary"
                            className="px-4 w-full"
                            icon={<MessageCircle />}
                        />
                    </Link>
                    <Link href={`mailto:${publicStore?.owner?.email || ''}`}>
                        <Button
                            text="Email"
                            onClick={() => { }}
                            type="button"
                            color="secondary"
                            className="px-4 w-full"
                            icon={<Mail />}
                        />
                    </Link>

                </div>
                <div>
                    <h2 className="text-xl font-semibold my-4">Produtos</h2>
                    <div>

                        {
                            publicStore?.products ? (
                                <>
                                    <div className="grid grid-cols-1 gap-4">

                                        {
                                            publicStore.products?.map((product: any, idx: number) => (
                                                <ProductItem key={idx} product={product} />
                                            ))
                                        }

                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-500 text-center">Nenhum produto por enquanto</p>
                                </>
                            )
                        }

                    </div>
                </div>
            </div>
        </>
    )
}