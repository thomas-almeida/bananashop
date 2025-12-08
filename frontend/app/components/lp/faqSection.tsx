
'use client'

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function FaqSection() {

    const [openAccordion, setOpenAccordion] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };


    return (
        <section className="px-5 py-12 bg-white">
            <h2 className="font-bold italic text-[34px] leading-7 tracking-tighter mb-6 text-black text-center px-8 my-6">
                Ainda pensando se o Bananashop é pra você?
            </h2>
            <p className="text-[13px] leading-4 font-medium text-center px-10 mb-4">Separamos as maiores dúvidas que nossos clientes tiveram</p>
            <div className="space-y-2">
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
        </section>
    )
}
