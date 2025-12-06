'use client'
import { useParams } from "next/navigation"
import { getTransactionById } from "@/app/service/transactionService"
import { useEffect, useState } from "react"
import Image from "next/image"
import { TransactionData } from "@/app/service/transactionService"
import { getProductById, ProductData } from "@/app/service/productService"
import { createProductPayload } from "@/app/service/productService"
import { getStoreById } from "@/app/service/storeService"
import Button from "@/app/components/form/Button"
import { Printer } from "lucide-react"

export default function TransactionResume() {
    const { transactionId } = useParams();
    const [transaction, setTransaction] = useState<TransactionData | null>(null);
    const [product, setProduct] = useState<ProductData | null>(null);
    const [store, setStore] = useState<any | null>(null);

    useEffect(() => {
        async function fetchTransactionAndProduct() {
            try {
                // Busca a transação
                const transactionData = await getTransactionById(transactionId as string);
                setTransaction(transactionData);

                // Se a transação tiver um productId, busca o produto
                if (transactionData?.productId) {
                    const productData = await getProductById(transactionData.productId);
                    setProduct(productData?.data);

                    if (productData?.data?.store) {
                        const storeData = await getStoreById(productData?.data?.store);
                        setStore(storeData?.data);
                    }
                }

            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                // Aqui você pode adicionar tratamento de erro, como mostrar uma mensagem para o usuário
            }
        }

        fetchTransactionAndProduct();
    }, [transactionId]);

    if (!store) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Image
                        src={"/logo.png"}
                        width={80}
                        height={80}
                        alt="logo"
                        priority
                        className="animate-pulse mx-auto mb-4"
                    />
                    <p className="text-gray-600">Carregando comprovante...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 flex justify-center items-start bg-slate-100 h-screen">
            <div className="w-[95%] bg-white p-4 rounded font-mono">

                <Image src={"/logo.png"} width={60} height={60} alt="logo" priority className="mx-auto" />

                <div className="mb-4">
                    <h1 className="text-2xl font-bold py-1">Comprovante de Transação</h1>
                    <p className="text-gray-800 text-sm font-mono">ID: {transactionId}</p>
                </div>

                <hr className="my-2 border-dashed" />

                <h2 className="text-xl font-semibold py-1 tracking-tighter">Produto</h2>
                <div className="flex justify-start items-start gap-4 mt-1 mb-4">
                    <Image
                        src={product?.images[0] || ""}
                        width={150}
                        height={150}
                        alt={product?.name || ""}
                        priority
                        className="rounded shadow-md"
                    />
                    <div>
                        <h3 className="text-xl font-semibold leading-tight">{product?.name}</h3>
                        <p className="line-clamp-3 text-sm text-slate-700 leading-tight">{product?.description}</p>
                    </div>
                </div>

                <div className="flex flex-col justify-start items-start mt-1 mb-4 text-lg">
                    <h3>Valor pago: <b>{transaction?.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b></h3>
                    <h3>Quantidade: <b>{transaction?.quantity}</b></h3>
                    <h3>Forma de Pgto: <b>PIX</b></h3>
                </div>

                <hr className="my-2 border-dashed" />

                <h2 className="text-xl font-semibold py-1 tracking-tighter">Dados da Loja</h2>
                <div className="flex justify-start items-start gap-4 mt-1 mb-4">
                    <div>
                        <Image src={store?.image} width={80} height={80} alt={store?.name} priority className="rounded shadow-md border border-slate-200 mb-4" />
                        <h3 className="leading-tight">Nome: {store?.name}</h3>
                        <p className="">Email: {store?.owner?.email}</p>
                        <p className="">Telefone: {store?.whatsappNumber}</p>
                    </div>
                </div>

                <hr className="my-2 border-dashed" />

                <h2 className="text-xl font-semibold py-1 tracking-tighter">Cliente</h2>
                <div className="flex justify-start items-start gap-4 mt-1 mb-4">
                    <div>
                        <h3 className="leading-tight">Nome: {transaction?.customer.name}</h3>
                        <p className="">Email: {transaction?.customer.email}</p>
                        <p className="">Telefone: {transaction?.customer.phone}</p>
                        <p className="">Endereço: {transaction?.customer.address}</p>
                        <p className="">Cidade: {transaction?.customer.city}</p>
                        <p className="">Estado: {transaction?.customer.state}</p>
                        <p className="">Cep: {transaction?.customer.postalCode}</p>
                    </div>
                </div>

                <Button
                    text="Imprimir Comprovante"
                    color="primary"
                    onClick={() => window.print()}
                    icon={<Printer />}
                />

            </div>
        </div>
    );
}