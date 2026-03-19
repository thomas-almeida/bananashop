"use client"

import Button from "@/app/components/form/Button";
import { Loader2, Mail, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useShop } from "@/hooks/use-shop";
import ProductItem from "@/app/components/products/productItem";
import Link from "next/link";
import Footer from "@/app/components/Footer";

export default function Store() {
    const { storename } = useParams();
    const { publicStore, loading } = useShop(storename as string);
    const [openAccordion, setOpenAccordion] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };


    if (loading || !publicStore) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Image src={"/logo.png"} width={80} height={80} alt="logo" priority className="animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-2 p-2 rounded-md bg-white min-h-screen">
            <div className="w-full max-w-7xl mx-auto lg:px-6">
                {/* Cabeçalho da Loja - Mobile & Desktop centralizado */}
                <div className="w-full mb-6">
                    <div className="shadow-md rounded-md border border-gray-300 p-2 py-6 mt-2 bg-white">
                        <div className="flex justify-center items-center gap-4 mb-2">
                            <Image
                                src={publicStore?.image || "/logo.png"}
                                alt="Logo"
                                width={80}
                                height={80}
                                className="rounded-full shadow border border-gray-300 h-20 w-20 object-cover"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-black">{storename}</h1>
                                <h2 className="text-lg font-medium text-gray-700">@{publicStore?.igNickname}</h2>
                            </div>
                        </div>
                        <div className="px-4 text-center max-w-2xl mx-auto">
                            <p className="text-gray-600 py-3 text-lg leading-relaxed">
                                {publicStore?.description}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 my-4 max-w-md mx-auto">
                        <Link
                            href={`https://api.whatsapp.com/send?phone=55${publicStore?.whatsappNumber}&text=Olá%2C%20vi%20sua%20loja%20no%20bananashop!%20🍌`}
                            target="_blank"
                        >
                            <Button
                                text="Whatsapp"
                                type="button"
                                color="primary"
                                className="w-full h-12 shadow-sm"
                                icon={<MessageCircle size={20} />}
                            />
                        </Link>
                        <Link href={`mailto:${publicStore?.owner?.email || ''}`}>
                            <Button
                                text="Email"
                                type="button"
                                color="secondary"
                                className="w-full h-12 border-gray-200"
                                icon={<Mail size={20} />}
                            />
                        </Link>
                    </div>
                </div>

                {/* Estrutura Principal: Desktop (2 colunas) vs Mobile (1 coluna) */}
                <div className="lg:grid lg:grid-cols-12 lg:gap-10 items-start">
                    
                    {/* Coluna de Produtos (Principal no Desktop) */}
                    <div className="lg:col-span-8 order-1 lg:order-1">
                        <div className="flex items-center justify-between mb-6 px-2">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Produtos</h2>
                            <span className="text-gray-500 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                                {publicStore?.products?.length || 0} itens
                            </span>
                        </div>
                        
                        <div className="px-1">
                            {publicStore?.products?.length! > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {publicStore?.products?.map((product: any, idx: number) => (
                                        <ProductItem key={idx} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-500 text-lg italic">Esta loja ainda não tem produtos</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Barra Lateral: Entrega e FAQ (Sticky no Desktop) */}
                    <div className="lg:col-span-4 order-2 lg:order-2 lg:sticky lg:top-10 space-y-8 mt-12 lg:mt-0">
                        {/* Formas de Entrega */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Formas de Entrega</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl shadow border border-gray-100 flex-shrink-0 overflow-hidden">
                                        <img src={"/uber.png"} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">Uber Bag</h3>
                                        <p className="text-gray-600 text-sm leading-tight">Entrega via aplicativo direto na sua porta</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl shadow border border-gray-100 flex-shrink-0 overflow-hidden">
                                        <img src={"/metro.png"} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">Metrô ou CPTM</h3>
                                        <p className="text-gray-600 text-sm leading-tight">Ponto de encontro em estações a combinar</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dúvidas Frequentes */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Dúvidas Frequentes</h3>
                            <div className="space-y-3">
                                {[
                                    {
                                        question: "Como vou receber minha entrega?",
                                        answer: "Após a confirmação do pagamento, você e a loja receberão a confirmação do pedido onde a loja entrará em contato com você para realizar a entrega."
                                    },
                                    {
                                        question: "O que acontece após o pagamento?",
                                        answer: "Você recebe a confirmação e o vendedor entra em contato via WhatsApp para combinar os detalhes finais da entrega."
                                    },
                                    {
                                        question: "Como falo com a loja?",
                                        answer: (
                                            <div className="flex flex-col gap-3">
                                                <p className="text-sm">Tire suas dúvidas diretamente com o vendedor:</p>
                                                <Link href={`https://api.whatsapp.com/send?phone=55${publicStore?.whatsappNumber}&text=Olá%2C%20vi%20sua%20loja%20no%20bananashop!%20🍌`} target="_blank">
                                                    <Button text="Chamar no Whats" color="secondary" className="w-full" />
                                                </Link>
                                            </div>
                                        )
                                    }
                                ].map((item, index) => (
                                    <div key={index} className="border border-gray-100 rounded-lg overflow-hidden">
                                        <button
                                            className="w-full px-4 py-3 text-left flex justify-between items-center bg-gray-50/50 hover:bg-gray-100 transition-colors"
                                            onClick={() => toggleAccordion(index)}
                                        >
                                            <span className="font-bold text-gray-800 text-xs uppercase tracking-wider">{item.question}</span>
                                            {openAccordion === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>
                                        <div className={`px-4 overflow-hidden transition-all duration-300 ${openAccordion === index ? 'max-h-96 py-4 border-t border-gray-100' : 'max-h-0'}`}>
                                            <div className="text-gray-600 text-sm leading-relaxed">{item.answer}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 mb-8">
                    <Footer />
                </div>
            </div>
        </div>
    )
}