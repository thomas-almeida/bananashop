'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProductById } from "@/app/service/productService";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Button from "@/app/components/form/Button";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getStoreById } from "@/app/service/storeService";
import Footer from "@/app/components/Footer";

export default function ProductPage() {
    const { productid } = useParams();
    const [product, setProduct] = useState<any | null>(null);
    const [storeInfo, setStoreInfo] = useState<any | null>(null);
    const [openAccordion, setOpenAccordion] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            const product = await getProductById(productid as string);
            setProduct(product?.data);
        };


        fetchProduct();


    }, [productid]);

    useEffect(() => {
        const fetchStoreInfo = async () => {
            if (!product?.store) return;
            const store = await getStoreById(product?.store as string);
            setStoreInfo(store?.data);
        }

        fetchStoreInfo();
    }, [product]);

    return (
        <div>
            {product ? (
                <div className="flex justify-center items-start">
                    <div className="flex flex-col justify-start items-start w-[90%] py-6 text-left">
                        <div className="w-full max-w-2xl mx-auto mb-4 relative">
                            <div>
                                <Link
                                    href={`/loja/${storeInfo?.name}`}
                                    className="py-4 text-center flex justify-center gap-2 items-center"
                                >
                                    {
                                        storeInfo && (
                                            <>
                                                <Image
                                                    src={storeInfo?.image || '/logo.png'}
                                                    alt={storeInfo?.name}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full border border-slate-200 shadow"
                                                />
                                                <h2 className="text-lg font-medium">{storeInfo?.name}</h2>

                                            </>
                                        )
                                    }
                                </Link>
                            </div>
                            <Slider
                                dots={true}
                                infinite={true}
                                speed={500}
                                slidesToShow={1}
                                slidesToScroll={1}
                                autoplay={true}
                                autoplaySpeed={5000}
                            >
                                {product?.images?.map((image: string, index: number) => (
                                    <div key={index} className="relative h-96">
                                        <Image
                                            src={image}
                                            alt={`${product?.name} - Imagem ${index + 1}`}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            priority={index === 0}
                                            className="rounded-xl shadow-lg"
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                        <h1 className="text-3xl font-bold uppercase py-2">{product?.name}</h1>
                        <p className="text-lg">{product?.description}</p>
                        <h2 className="text-4xl py-3 font-bold">{product?.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                        {
                            product?.brand !== "" && (
                                <p className="text-lg pb-4">Marca: <b className="text-neutral-700">{product?.brand}</b></p>
                            )
                        }

                        <Button
                            text="Comprar Agora no PIX"
                            color="primary"
                            onClick={() => { }}
                        />

                        <div className="mt-8 w-full max-w-2xl">
                            <h3 className="text-xl font-bold mb-4">Dúvidas de como comprar:</h3>
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
                                                <Link href={""} className="block mt-2">
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

                    </div>
                </div>
            ) : (
                <p>Produto não encontrado</p>
            )
            }
            <Footer />
        </div >
    )
}