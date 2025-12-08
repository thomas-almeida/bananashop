
export function StepsSection() {
    const steps = [
        {
            number: 1,
            title: "Traga sua loja",
            description: "Insira os dados da sua loja do Instagram para criar sua página super rápido",
            color: "text-[#22C55E]",
        },
        {
            number: 2,
            title: "Traga sua chave PIX",
            description:
                "Insira a chave pix para receber pagamentos de forma rápida. O bananashop é a melhor forma de recebê-los",
            color: "text-[#22C55E]",
        },
        {
            number: 3,
            title: "Traga seus produtos",
            description:
                "Inde seus produtos e comece a compartilhar o link na sua loja na sua bio, agora seus clientes podem comprar direto na sua página",
            color: "text-[#22C55E]",
        },
    ]

    return (
        <section className="px-5 py-12 bg-white">
            <div className="max-w-md mx-auto">
                <h2 className="font-bold italic text-[34px] leading-7 tracking-tighter mb-6 text-black text-center px-8 my-6">
                    Comece a vender em 3 passos
                </h2>

                <div className="space-y-5">
                    {steps.map((step) => (
                        <div key={step.number} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                            <div className={`${step.color} font-serif italic font-bold text-[56px] leading-none mb-3`}>
                                {step.number}
                            </div>
                            <h3 className="font-semibold text-[18px] mb-2 text-black">{step.title}</h3>
                            <p className="text-[13px] leading-relaxed text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
