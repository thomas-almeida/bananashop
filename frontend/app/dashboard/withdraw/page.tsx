'use client'

import { getWithdrawsByUserId } from "@/app/service/withdrawService";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type WithdrawStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

interface Withdraw {
    _id: string;
    value: number;
    status: WithdrawStatus;
    createdAt: string;
    userId: string;
    storeId: string;
}

interface WithdrawsResponse {
    withdraws: Withdraw[];
}

export default function WithdrawPage() {

    const { user } = useUser();
    const [withdraw, setWithdraw] = useState<WithdrawsResponse | null>(null);
    useEffect(() => {
        async function fetchWithdraw() {
            try {
                if (!user) return;
                const withdrawData = await getWithdrawsByUserId(user._id);
                setWithdraw(withdrawData?.data);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        }
        fetchWithdraw();
    }, [user]);

    if (!withdraw) {
        return (
            <div className="flex items-center justify-center">
                <div className="text-center">
                    <Image
                        src={"/logo.png"}
                        width={80}
                        height={80}
                        alt="logo"
                        priority
                        className="animate-pulse mx-auto mb-4"
                    />
                    <p className="text-gray-600">Carregando seus saques</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-center items-start">
                <div className="space-y-6 w-[95%]">

                    <div>
                        <Link
                            href={"/dashboard"}
                            className="flex justify-start items-center mb-5 border border-slate-200 max-w-[100px] p-2 rounded shadow text-lg font-medium gap-2"
                        >
                            <ArrowLeft />
                            Voltar
                        </Link>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Meus Saques</h1>
                        <p className="text-sm text-gray-500 mt-1">Acompanhe o histórico de seus saques</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Valor
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Data
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {withdraw?.withdraws?.length > 0 ? (
                                        withdraw.withdraws.map((item: any) => {
                                            const date = new Date(item.createdAt);
                                            const formattedDate = date.toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            });

                                            const statusStyles = {
                                                PENDING: 'bg-yellow-100 text-yellow-800',
                                                APPROVED: 'bg-green-100 text-green-800',
                                                REJECTED: 'bg-red-100 text-red-800',
                                                COMPLETED: 'bg-blue-100 text-blue-800'
                                            } as const;

                                            // Verifica se o status é válido antes de acessar o objeto
                                            const status = ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'].includes(item.status)
                                                ? item.status as WithdrawStatus
                                                : 'PENDING';

                                            const statusStyle = statusStyles[status] || 'bg-gray-100 text-gray-800';

                                            return (
                                                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {new Intl.NumberFormat('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL'
                                                        }).format(item.value)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formattedDate}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyle}`}>
                                                            {item.status === 'PENDING' ? 'Pendente' :
                                                                item.status === 'APPROVED' ? 'Aprovado' :
                                                                    item.status === 'REJECTED' ? 'Rejeitado' :
                                                                        item.status === 'COMPLETED' ? 'Concluído' : item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                                Nenhum saque encontrado
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}