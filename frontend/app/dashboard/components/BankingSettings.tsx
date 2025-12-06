'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bankingSchema } from '@/app/onboarding/schemas/onboardingSchema';
import { updateUser } from '@/app/service/userService';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Input from '../../components/form/Input';
import Button from '../../components/form/Button';

// Definindo o tipo para os métodos de pagamento

// Mapeamento entre taxas e métodos de pagamento
const RATE_TO_METHOD: { [key: number]: string } = {
    0.05: 'IMEDIATO',
    0.03: 'SEMANAL',
    0.015: 'MENSAL'
};

// Mapeamento reverso para obter a taxa a partir do método
const METHOD_TO_RATE: { [key in string]: number } = {
    'IMEDIATO': 0.05,
    'SEMANAL': 0.03,
    'MENSAL': 0.015
};

type BankingForm = z.infer<typeof bankingSchema>;

export default function BankingSettings({ user }: { user: any }) {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    // Determina o método de pagamento com base na taxa atual
    const getCurrentPayoutMethod = () => {
        if (!user?.banking) return 'IMEDIATO';
        return RATE_TO_METHOD[user.banking.rate] || 'IMEDIATO';
    };

    const [selected, setSelected] = useState<string>(getCurrentPayoutMethod());

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BankingForm>({
        resolver: zodResolver(bankingSchema),
        defaultValues: {
            taxID: user?.banking?.taxId || '',
            pixKey: user?.banking?.pixKey || '',
            payoutMethod: selected
        },
    });

    // Atualiza os valores iniciais quando o usuário for carregado
    useEffect(() => {
        if (user?.banking) {
            const currentMethod = getCurrentPayoutMethod();
            setSelected(currentMethod);

            reset({
                taxID: user.banking.taxId || '',
                pixKey: user.banking.pixKey || '',
            });
        }
    }, [user]);

    const handleSelect = (option: string) => {
        setSelected(option);
        // Atualiza o valor do formulário quando a seleção mudar
        reset({
            taxID: user?.banking?.taxId || '',
            pixKey: user?.banking?.pixKey || '',
            payoutMethod: option
        }, { keepDefaultValues: true });
    };

    const onSubmit = async (data: BankingForm) => {


        if (!session?.user?.id) {
            console.error('ID do usuário não encontrado na sessão');
            return;
        }

        setIsLoading(true);

        try {
            const rate = METHOD_TO_RATE[selected];
            console.log('Dados a serem salvos:', {
                ...data,
                rate,
                userId: session.user.id
            });

            await updateUser(session.user.id, {
                taxId: data.taxID,
                pixKey: data.pixKey,
                rate,
            })
            
            toast.success('Dados bancários atualizados com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar dados bancários:', error);
            toast.error('Erro ao salvar dados bancários. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const calcularValorLiquido = (tipo: string) => {
        const discount = METHOD_TO_RATE[tipo];
        const liquidValue = 100 - (100 * discount);
        return liquidValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Dados Bancários</h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="CPF"
                        type="text"
                        placeholder="000.000.000-00"
                        {...register('taxID', {
                            required: 'CPF é obrigatório',
                        })}
                        error={errors.taxID?.message}
                    />

                    <Input
                        label="Chave PIX"
                        type="text"
                        placeholder="Sua chave PIX"
                        {...register('pixKey')}
                        error={errors.pixKey?.message}
                    />
                </div>

                <div>
                    <label className="block text-xl font-semibold mb-4">
                        Sua Modalidade de Saque
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(['IMEDIATO', 'SEMANAL', 'MENSAL'] as const).map((option) => {
                            const isSelected = selected === option;
                            const rate = METHOD_TO_RATE[option];
                            const ratePercentage = (rate * 100);

                            return (
                                <div
                                    key={option}
                                    onClick={() => handleSelect(option)}
                                    className={`p-4 relative border rounded-lg cursor-pointer transition-colors ${isSelected
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="font-medium">
                                        {option === 'IMEDIATO' && 'Repasse Imediato'}
                                        {option === 'SEMANAL' && 'Repasse Semanal'}
                                        {option === 'MENSAL' && 'Repasse Mensal'}
                                    </div>
                                    <div className="absolute top-1.5 right-2 text-md border border-slate-300 px-2 p-0.5 max-w-[100px] text-center rounded-full">
                                        Taxa: {ratePercentage}%
                                    </div>
                                    <div className="text-sm font-medium mt-1">
                                        Exemplo: você recebe <b className="text-green-700">{calcularValorLiquido(option)}</b> líquidos numa venda de R$ 100,00

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        text="Salvar Alterações"
                        isLoading={isLoading}
                        className="px-6"
                        color='primary'
                    />
                </div>
            </form>
        </div>
    );
}
