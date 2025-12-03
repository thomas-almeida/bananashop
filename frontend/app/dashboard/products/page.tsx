'use client'

import { useState } from "react"
import { useProducts } from "@/hooks/use-products"
import { useUser } from "@/hooks/use-user";
import Button from "@/app/components/form/Button";
import CreateProductModal from "@/app/components/modal/createProductModal";
import { File, Plus, Eye, SquarePen } from "lucide-react";
import Image from "next/image";

export default function Products() {
    const { products, loading, refetch } = useProducts();
    const [isModalOpen, setModalOpen] = useState(false)
    const { user } = useUser();
    console.log(products)

    if (loading) {
        return <div className="px-4">Carregando produtos...</div>;
    }

    return (
        <>
            <div className="px-4">

                <div>
                    <h1 className="text-3xl font-semibold">Produtos</h1>
                    <p className="text-neutral-700">Gerencie os produtos da sua loja</p>
                    <Button
                        text="Adicionar"
                        color="primary"
                        className="py-1 my-4"
                        onClick={() => setModalOpen(true)}
                        icon={<Plus className="w-6 h-6" />}
                    />
                </div>

                <div className="">
                    {
                        products == null && (
                            <>
                                <div className="flex flex-col justify-center items-center text-center py-24">
                                    <div className="w-[90%] max-w-md">
                                        <p className="text-neutral-500">Nenhum produto cadastrado</p>
                                        <p className="text-sm text-neutral-400 mb-4">Comece adicionando seu primeiro produto</p>
                                        <Button
                                            text="Adicionar Produto"
                                            color="primary"
                                            onClick={() => setModalOpen(true)}
                                            icon={<Plus className="w-6 h-6" />}
                                        />
                                        <p className="text-sm text-neutral-400 my-4">Ou</p>
                                        <Button
                                            text="Importar CSV"
                                            color="secondary"
                                            onClick={() => { }}
                                            icon={<File className="w-6 h-6" />}
                                        />
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>
                <div className="flex flex-col gap-4">
                    {
                        products && (
                            products?.map((product: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="relative border border-slate-200 p-4 rounded shadow space-y-4"
                                >
                                    <div className="flex justify-start items-center gap-4">
                                        <div className="shrink-0">
                                            <Image
                                                src={product.images[0]}
                                                width={100}
                                                height={100}
                                                alt={product.description}
                                                className="shadow-md rounded border border-slate-200"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold">{product.name}</h3>
                                            <p className="text-md text-neutral-600 font-medium">R$ {product.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-4 border border-slate-200 rounded-md shadow bg-[#22C55E] text-white">
                                            <Eye />
                                            Ver Produto
                                        </div>
                                        <div className="p-4 border border-slate-200 rounded-md shadow">
                                            <SquarePen />
                                            Editar
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
            <CreateProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setModalOpen(false)
                    refetch()
                }}
                storeId={user?.store || ""}
            />
        </>

    )
}