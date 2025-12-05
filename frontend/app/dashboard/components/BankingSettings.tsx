'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bankingSchema } from '@/app/onboarding/schemas/onboardingSchema';
import { useUser } from '@/hooks/use-user';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Input from '../../components/form/Input';
import Button from '../../components/form/Button';

// Definindo o tipo para os métodos de pagamento
type PayoutMethod = 'IMEDIATO' | 'SEMANAL' | 'MENSAL';

// Mapeamento entre taxas e métodos de pagamento
const RATE_TO_METHOD: { [key: number]: PayoutMethod } = {
    0.05: 'IMEDIATO',
    0.03: 'SEMANAL',
    0.015: 'MENSAL'
};

// Mapeamento reverso para obter a taxa a partir do método
const METHOD_TO_RATE: { [key in PayoutMethod]: number } = {
    'IMEDIATO': 0.05,
    'SEMANAL': 0.03,
    'MENSAL': 0.015
};

type BankingForm = z.infer<typeof bankingSchema>;

export default function BankingSettings({ user }: { user: any }) {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    // Determina o método de pagamento com base na taxa atual
    const getCurrentPayoutMethod = (): PayoutMethod => {
        if (!user?.banking) return 'IMEDIATO';
        return RATE_TO_METHOD[user.banking.rate] || 'IMEDIATO';
    };

    const [selected, setSelected] = useState<PayoutMethod>(getCurrentPayoutMethod());

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm<BankingForm>({
        resolver: zodResolver(bankingSchema),
        defaultValues: {
            taxID: user?.banking?.taxId || '',
            pixKey: user?.banking?.pixKey || '',
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

    const handleSelect = (option: PayoutMethod) => {
        setSelected(option);
        // Não precisamos mais definir o valor no formulário, já que usamos o estado local
    };

    const onSubmit = async (data: BankingForm) => {
        if (!session?.user?.id) return;

        setIsLoading(true);

        try {
            // Aqui você implementaria a lógica para salvar os dados
            // Incluindo a taxa baseada no método selecionado
            const rate = METHOD_TO_RATE[selected];
            console.log('Dados a serem salvos:', {
                ...data,
                rate
            });

            // Exemplo de como seria a chamada à API:
            // await updateBankingData(session.user.id, {
            //     taxId: data.taxID,
            //     pixKey: data.pixKey,
            //     rate: rate
            // });

            toast.success('Dados bancários atualizados com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar dados bancários:', error);
            toast.error('Erro ao salvar dados bancários');
        } finally {
            setIsLoading(false);
        }
    };

    const calcularValorLiquido = (tipo: PayoutMethod) => {
        const valorVenda = 1000; // Valor de exemplo para cálculo
        if (tipo === 'IMEDIATO') return `R$${(valorVenda * 0.95).toFixed(2).replace('.', ',')}`;
        if (tipo === 'SEMANAL') return `R$${(valorVenda * 0.97).toFixed(2).replace('.', ',')}`;
        return `R$${(valorVenda * 0.99).toFixed(2).replace('.', ',')}`;
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Dados Bancários</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="CPF"
                        type="text"
                        placeholder="000.000.000-00"
                        {...register('taxID')}
                    />

                    <Input
                        label="Chave PIX"
                        type="text"
                        placeholder="Sua chave PIX"
                        {...register('pixKey')}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Método de Pagamento
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(['IMEDIATO', 'SEMANAL', 'MENSAL'] as const).map((option) => {
                            const isSelected = selected === option;
                            const rate = METHOD_TO_RATE[option];
                            const ratePercentage = (rate * 100).toFixed(0);

                            return (
                                <div
                                    key={option}
                                    onClick={() => handleSelect(option)}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${isSelected
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="font-medium">
                                        {option === 'IMEDIATO' && 'Pagamento Imediato'}
                                        {option === 'SEMANAL' && 'Pagamento Semanal'}
                                        {option === 'MENSAL' && 'Pagamento Mensal'}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Taxa: {ratePercentage}%
                                    </div>
                                    <div className="text-sm font-medium mt-1">
                                        {calcularValorLiquido(option)} líquidos
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
