'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { withdrawSchema } from "@/app/dashboard/withdraw/schema/withdrawSchema"
import Button from "../form/Button"
import Input from "../form/Input"
import { Check, DollarSign } from "lucide-react"
import { createWithdrawal } from "@/app/service/withdrawService"
import { ToastContainer, toast } from "react-toastify"

interface WithdrawModalProps {
    user: any;
    isOpen: boolean;
    onClose: () => void
}

export default function WithdrawModal({ user, isOpen, onClose }: WithdrawModalProps) {

    // Função para fechar o modal ao clicar fora do conteúdo
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    type FormData = {
        value: number;
        userId: string;
        storeId: string;
    };

    const methods = useForm<FormData>({
        resolver: zodResolver(withdrawSchema as any),
        defaultValues: {
            value: 0,
            userId: user?.id || '',
            storeId: user?.store || ''
        }
    })

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = methods

    const amount = watch('value')
    const availableBalance = user?.banking?.balance || 0

    const onSubmit = async (data: any) => {
        try {

            const payload = {
                value: data.value,
                userId: user?._id,
                storeId: user?.store
            }
            
            const response = await createWithdrawal(payload)
            toast.success(response?.data?.message || 'Saque solicitado com sucesso')
            setTimeout(() => {
                onClose()
                setValue("value", 0)
            }, 3000)

        } catch (error: any) {
            console.error('Erro ao criar saque:', error)
            toast.error(error.response?.data?.message || 'Erro ao processar o saque')
        }
    }

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/45 flex justify-center items-end z-50 transition-opacity duration-300"
            onClick={handleBackdropClick}
        >
            <ToastContainer icon={<Check />} />
            <div className="bg-white w-full max-w-2xl max-h-[85%] rounded-t-2xl p-6 animate-slide-up overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Solicitar Saque
                    </h1>
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
                <p className="text-gray-500">Insira o valor e confirme abaixo para receber o repasse</p>

                <div className="mt-4 mb-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Saldo disponível</p>
                    <p className="text-2xl font-bold ">
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(availableBalance)}
                    </p>
                    {amount > availableBalance && (
                        <p className="mt-1 text-sm text-red-500">
                            Saldo insuficiente para este valor
                        </p>
                    )}
                </div>

                <div className="py-2">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <div className="w-full">
                            <Input
                                type="number"
                                placeholder="R$ 0,00"
                                startIcon={<DollarSign className="h-5 w-5 text-gray-400" />}
                                error={errors.value?.message}
                                className="text-lg font-medium"
                                {...register("value")}
                            />
                        </div>
                        <Button
                            type="submit"
                            text="Confirmar Saque"
                            color="primary"
                            icon={<Check />}
                            disabled={isSubmitting || amount <= 0 || amount > availableBalance || amount < 10}
                            loading={isSubmitting}
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}