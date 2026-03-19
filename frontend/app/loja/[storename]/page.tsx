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
        <>
            <div className="flex flex-col items-center justify-center gap-2 p-2 rounded-md">
                <div className="w-[95%]">
                    <div>
                        <div className="shadow-md rounded-md border border-gray-300 p-2 py-4 mt-2">
                            <div className="flex justify-center items-center gap-2 mb-2">
                                <Image
                                    src={publicStore?.image || "/logo.png"}
                                    alt="Logo"
                                    width={65}
                                    height={65}
                                    className="rounded-full shadow border border-gray-300"
                                />
                                <div>
                                    <h1 className="text-xl font-bold text-black">{storename}</h1>
                                    <h2 className="text-md font-medium text-gray-700">@{publicStore?.igNickname}</h2>
                                </div>
                            </div>
                            <div className="px-4 text-center">


                                <p className="text-gray-500 py-3">
                                    {publicStore?.description}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 my-2">
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
                                publicStore?.products?.length! > 0 && (
                                    <>
                                        <div className="grid grid-cols-1 gap-4">

                                            {
                                                publicStore?.products?.map((product: any, idx: number) => (
                                                    <ProductItem key={idx} product={product} />
                                                ))
                                            }

                                        </div>
                                    </>
                                )

                            }

                            {
                                publicStore.products?.length! === 0 && (
                                    <p className="text-gray-500 text-center">Esta loja ainda não tem produtos</p>
                                )
                            }

                        </div>
                    </div>

                    <div className="mt-8 w-full max-w-2xl">
                        <h3 className="text-xl font-bold">Formas de Entrega</h3>
                        <p className="mb-4">Selecione uma das seguintes ao prosseguir para finalizar a compra</p>
                        <div className="p-2 px-0 flex flex-col gap-2">
                            <div className="flex justify-start items-center gap-2 p-1">
                                <img
                                    src={"/uber.png"}
                                    className="w-16 h-16 rounded-lg shadow"
                                />
                                <div>
                                    <h3 className="font-bold text-xl">Uber Bag</h3>
                                    <p>Seu produto será entregue via Uber até a sua residência</p>
                                </div>
                            </div>
                            <div className="flex justify-start items-center gap-2 p-1">
                                <img
                                    src={"/metro.png"}
                                    className="w-16 h-16 rounded-lg shadow"
                                />
                                <div>
                                    <h3 className="font-bold text-xl">Metrô ou CPTM</h3>
                                    <p>Combine de se encontrar com o vendedor em uma das estações</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 w-full max-w-2xl">
                        <h3 className="text-lg font-bold mb-4">Dúvidas de como comprar:</h3>
                        <div className="space-y-2">
                            {[
                                {
                                    question: "Como vou receber minha entrega?",
                                    answer: "Após a confirmação do pagamento, você e a loja receberão a confirmação do pedido onde a loja entrará em contato com você para realizar a entrega."
                                },
                                {
                                    question: "O que acontece após o pagamento? estou protegido?",
                                    answer: "Após a confirmação do pagamento,vcoê e a loja recebem a confirmação, a loja entrará em contato com você para ajustar a entrega do produto. não se preocupe, caso algo dê errado seu reembolso poderá ser realizado normalmente"
                                },
                                {
                                    question: "Existe garantia?",
                                    answer: "Sim, existe garantia de 7 dias, caso o produto não atenda às expectativas ou não seja entregue, você poderá solicitar o reembolso normalmente."
                                },
                                {
                                    question: "Como falo com a loja?",
                                    answer: (
                                        <>
                                            Caso precise de ajuda ou tenha mais perguntas você pode entrar em contato direto com este perfil:
                                            <Link href={"https://api.whatsapp.com/send?phone=55" + publicStore?.whatsappNumber + "&text=Olá%2C%20vi%20sua%20loja%20no%20bananashop!%20🍌"} className="block mt-2">
                                                <Button
                                                    text="Falar com a loja"
                                                    color="secondary"
                                                    className="my-2"
                                                />
                                            </Link>
                                        </>
                                    )
                                }
                            ].map((item, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        className="w-full px-4 py-3 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                                        onClick={() => toggleAccordion(index)}
                                        aria-expanded={openAccordion === index}
                                        aria-controls={`accordion-content-${index}`}
                                    >
                                        <span className="font-medium text-gray-900">{item.question}</span>
                                        {openAccordion === index ? (
                                            <ChevronUp className="h-5 w-5 text-gray-500" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-gray-500" />
                                        )}
                                    </button>
                                    <div
                                        id={`accordion-content-${index}`}
                                        className={`px-4 overflow-hidden transition-all duration-300 ${openAccordion === index ? 'max-h-96 py-4' : 'max-h-0'}`}
                                        aria-hidden={openAccordion !== index}
                                    >
                                        <div className="text-gray-600 pb-2">
                                            {item.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {
                        publicStore?.products.length > 0 && (
                            <Footer />
                        )
                    }
                </div>
            </div>
        </>
    )
}