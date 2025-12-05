'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerCheckoutFormData, customerCheckoutSchema } from "@/app/loja/schemas/checkoutSchema";
import Input from "../form/Input";
import { User, Mail, Phone, MapPin, Home, Map, MapPinIcon, Minus, Plus } from "lucide-react";
import Button from "../form/Button";
import { createTransaction } from "@/app/service/transactionService";
import { useRouter } from "next/navigation";

interface TransactionResponse {
    _id: string;
    brcode: string;
    brCodeBase64: string;
    pixId: string;
    expiresIn: number;
    transactionId: string;
}

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (transactionData: TransactionResponse) => void;
    productId: string;
    storeId: string;
    price: number;
    inStorage: number;
}

export default function CheckoutModal({ isOpen, onClose, onSuccess, productId, storeId, price, inStorage }: CheckoutModalProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CustomerCheckoutFormData>({
        resolver: zodResolver(customerCheckoutSchema),
    });

    const onSubmit = async (data: CustomerCheckoutFormData) => {
        try {
            const transactionData = {
                productId,
                quantity,
                value: price * quantity,
                customer: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    postalCode: data.zipCode,
                },
            };

            const response = await createTransaction(transactionData);
            onSuccess(response);
            onClose();

        } catch (error) {

            console.error('Erro ao finalizar compra:', error);
            alert('Ocorreu um erro ao processar sua compra. Por favor, tente novamente.');
        }
    };

    // Função para fechar o modal ao clicar fora do conteúdo
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Previne que o clique dentro do modal feche-o
    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/45 flex justify-center items-end z-50 transition-opacity duration-300"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white w-full max-w-2xl max-h-[85%] rounded-t-2xl p-6 animate-slide-up overflow-y-auto"
                onClick={handleModalClick}
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Finalizar Compra
                        </h1>
                        <p className="text-gray-500">Preencha seus dados para continuar com o pagamento.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Fechar modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="py-4">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="grid grid-cols-1 gap-4"
                    >
                        <Input
                            placeholder="Nome completo"
                            type="text"
                            icon={<User className="h-5 w-5 text-gray-400" />}
                            {...register("name")}
                            error={errors.name}
                        />

                        <Input
                            placeholder="E-mail"
                            type="email"
                            icon={<Mail className="h-5 w-5 text-gray-400" />}
                            {...register("email")}
                            error={errors.email}
                        />

                        <Input
                            placeholder="Telefone"
                            type="tel"
                            icon={<Phone className="h-5 w-5 text-gray-400" />}
                            {...register("phone")}
                            error={errors.phone}
                        />

                        <div className="grid grid-cols-1 gap-4">
                            {/* Seletor de quantidade */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block font-medium text-gray-700">Quantidade</label>
                                    <span className="text-sm text-gray-500">
                                        {inStorage} disponíveis
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((prev: number) => Math.max(1, prev - 1))}
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((prev: number) => Math.min(inStorage, prev + 1))}
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={quantity >= inStorage}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <Input
                                placeholder="CEP"
                                type="text"
                                icon={<MapPinIcon className="h-5 w-5 text-gray-400" />}
                                {...register("zipCode")}
                                error={errors.zipCode}
                            />

                            <Input
                                placeholder="Estado (UF)"
                                type="text"
                                icon={<Map className="h-5 w-5 text-gray-400" />}
                                {...register("state")}
                                error={errors.state}
                            />
                        </div>

                        <Input
                            placeholder="Cidade"
                            type="text"
                            icon={<MapPin className="h-5 w-5 text-gray-400" />}
                            {...register("city")}
                            error={errors.city}
                        />

                        <Input
                            placeholder="Endereço"
                            type="text"
                            icon={<Home className="h-5 w-5 text-gray-400" />}
                            {...register("address")}
                            error={errors.address}
                        />

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex justify-between items-center w-full">
                                    <div>
                                        <div className="text-gray-600">Quantidade: {quantity}x</div>
                                        <div className="text-gray-600">Preço unitário: {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-600">Total:</div>
                                        <span className="text-2xl font-bold">
                                            {(price * quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                text="Finalizar Compra"
                                color="primary"
                                loading={isSubmitting}
                                className="w-full"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
