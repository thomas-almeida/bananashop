"use client"

import Button from "@/app/components/form/Button";
import { Mail, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function Store() {
    const { storename } = useParams();
    return (
        <>
            <div className="flex flex-col items-center justify-center gap-2 p-2 rounded-md">
                <div className="w-[90%]">
                    <div className="flex flex-col items-center gap-2 shadow-md rounded-md border border-gray-300 p-2 py-6">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={65}
                            height={65}
                            className="rounded-full shadow border border-gray-300"
                        />
                        <div className="px-4 text-center">
                            <h1 className="text-xl font-bold text-black py-1">{storename}</h1>
                            <p className="text-gray-500">Descrição do produto simples e rápida como tamanho e detalhes</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 w-[90%] my-2">
                    <Button
                        text="Whatsapp"
                        onClick={() => { }}
                        type="button"
                        color="primary"
                        className="px-4 w-full"
                        icon={<MessageCircle />}
                    />
                    <Button
                        text="Email"
                        onClick={() => { }}
                        type="button"
                        color="secondary"
                        className="px-4 w-full"
                        icon={<Mail />}
                    />
                </div>
                <div>
                    <h2 className="text-xl font-semibold my-4">Produtos</h2>
                    <div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}