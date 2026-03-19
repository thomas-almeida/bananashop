
'use client'

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function FaqSection() {

    const [openAccordion, setOpenAccordion] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };


    return (
        <section className="px-5 py-16 lg:py-24 bg-white max-w-4xl mx-auto">
            <div className="text-center mb-12 lg:mb-16">
                <h2 className="font-black italic text-[34px] lg:text-[56px] leading-tight tracking-tighter mb-6 text-black">
                    Ainda pensando se o Bananashop é pra você?
                </h2>
                <p className="text-[15px] lg:text-[19px] font-medium text-gray-600 px-10">
                    Separamos as maiores dúvidas que nossos clientes tiveram para te ajudar a decidir.
                </p>
            </div>

            <div className="space-y-4">
                {[
                    {
                        question: "O que é o Bananashop? é pra mim?",
                        answer:
                            "O Bananashop é uma plataforma onde você pode criar um linktree dos seus produtos, permitindo vendas diretas via PIX, sem ficar combinando valores na sua DM e perdendo vendas.",
                    },
                    {
                        question: "Como sei quem comprou de mim?",
                        answer:
                            "Você receberá notificações de todas as vendas e terá acesso a um dashboard completo com informações dos compradores.",
                    },
                    {
                        question: "Como posso sacar minhas vendas?",
                        answer:
                            "As vendas caem direto na sua conta através da chave PIX cadastrada. Você tem controle total do seu dinheiro.",
                    },
                    {
                        question: "Tem alguma taxa?",
                        answer: "Cobramos apenas uma pequena taxa de transação para manter a plataforma funcionando.",
                    },
                    {
                        question: "Vocês tem suporte?",
                        answer: "Sim! Temos suporte dedicado para ajudar você em todas as etapas do processo.",
                    },
                ].map((item, index) => (
                    <div key={index} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <button
                            className="w-full px-6 py-5 text-left flex justify-between items-center bg-gray-50/50 hover:bg-gray-100 transition-colors"
                            onClick={() => toggleAccordion(index)}
                        >
                            <span className="font-bold text-lg lg:text-xl text-gray-900 leading-tight">{item.question}</span>
                            {openAccordion === index ? (
                                <ChevronUp className="h-6 w-6 text-gray-500" />
                            ) : (
                                <ChevronDown className="h-6 w-6 text-gray-500" />
                            )}
                        </button>
                        <div
                            className={`px-6 overflow-hidden transition-all duration-300 ${openAccordion === index ? 'max-h-96 py-6 border-t border-gray-100' : 'max-h-0'}`}
                        >
                            <div className="text-gray-600 text-base lg:text-lg leading-relaxed">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
