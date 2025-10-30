'use client'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useOnboardingStore } from "../store/useOnboardingStore"
import { bankingSchema } from "../schemas/onboardingSchema"
import { User, DollarSign, Landmark } from "lucide-react"
import { redirect } from "next/navigation"

import Input from "../../components/form/Input"
import Button from "../../components/form/Button"

type BankingForm = z.infer<typeof bankingSchema>

export default function StepBanking() {
    const { banking, setBanking } = useOnboardingStore()
    const [valorVenda, setValorVenda] = useState<number>(1000)
    const [selected, setSelected] = useState<"IMEDIATO" | "SEMANAL" | "MENSAL" | null>(
        banking.rate as "IMEDIATO" | "SEMANAL" | "MENSAL" | null
    )

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<BankingForm>({
        resolver: zodResolver(bankingSchema),
        defaultValues: {
            taxID: banking.taxID || "",
            pixKey: banking.pixKey || "",
            payoutMethod: banking.rate as any,
        },
    })

    const handleSelect = (option: "IMEDIATO" | "SEMANAL" | "MENSAL") => {
        setSelected(option)
        setValue("payoutMethod", option)
    }

    const calcularValorLiquido = (tipo: "IMEDIATO" | "SEMANAL" | "MENSAL") => {
        if (!valorVenda || valorVenda <= 0) return "R$0,00"

        // Definindo as taxas conforme o tipo de saque
        const taxas = {
            "IMEDIATO": 0.050,
            "SEMANAL": 0.025,
            "MENSAL": 0.015
        }

        const taxa = taxas[tipo]
        const valorFinal = valorVenda - (valorVenda * taxa)

        return valorFinal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        })
    }

    const onSubmit = (values: BankingForm) => {
        // Mapeia o payoutMethod para o rate que a store espera
        setBanking({
            ...values,
            rate: values.payoutMethod
        })
        redirect("/dashboard")
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-semibold">Adicione seus dados de pagamento</h2>
                <p className="text-sm text-gray-500">
                    Insira os dados por onde gostaria de receber os valores dos pedidos dos seus clientes quando comprarem através da sua loja
                </p>
            </div>

            <div>
                <Input
                    placeholder="Informe seu CPF"
                    register={register("taxID")}
                    errors={errors.taxID}
                    type="text"
                    label="CPF"
                    icon={<User size={20} />}
                />
            </div>

            <div>
                <Input
                    placeholder="Sua chave Pix de preferência"
                    register={register("pixKey")}
                    errors={errors.pixKey}
                    type="text"
                    label="Chave Pix"
                    icon={<Landmark size={20} />}
                />
            </div>

            <div>
                <h3 className="font-semibold text-xl">Forma de Saque</h3>
                <p className="text-sm text-gray-500 mb-2">
                    Escolha como deseja receber os valores das suas vendas.
                </p>

                <Input
                    placeholder="Insira um valor exemplo"
                    type="number"
                    label="Se você vender"
                    icon={<DollarSign size={20} />}
                    className="mb-3"
                    value={valorVenda}
                    onChange={(e) => setValorVenda(Number(e.target.value))}
                />

                <div className="space-y-2">
                    {[
                        { id: "IMEDIATO", label: "Dia ZERO", description: "Consiga sacar seu saldo de vendas uma vez por dia" },
                        { id: "SEMANAL", label: "Semanal", description: "Consiga sacar seu saldo de vendas uma vez por semana" },
                        { id: "MENSAL", label: "Mensal", description: "Consiga sacar seu saldo de vendas uma vez por mês" },
                    ].map((op) => (
                        <button
                            key={op.id}
                            type="button"
                            onClick={() => handleSelect(op.id as any)}
                            className={`w-full cursor-pointer border p-3 rounded-lg flex justify-between items-center transition-all
                ${selected === op.id ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}
                        >
                            <div className="text-left w-3/5">
                                <div className="font-semibold flex justify-start items-center gap-2 mb-2">
                                    {op.label}
                                    <p className="text-sm text-gray-500">
                                        {op.id === 'IMEDIATO' && '5% por transação'}
                                        {op.id === 'SEMANAL' && '2.5% por transação'}
                                        {op.id === 'MENSAL' && '1.5% por transação'}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {op.description}
                                </p>
                            </div>
                            <div className="text-right relative">
                                <p className="text-sm text-gray-500">Você recebe:</p>
                                <p className="font-semibold text-green-600 text-xl">
                                    {calcularValorLiquido(op.id as any)}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <Button
                type="submit"
                text="Finalizar Cadastro"
                color="primary"
                disabled={selected === null}
            />
        </form>
    )
}
