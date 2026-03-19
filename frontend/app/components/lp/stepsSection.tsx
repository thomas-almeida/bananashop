'use client'

import Image from "next/image"
import { useRef, useEffect } from "react"

export function StepsSection() {
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

    // Inicializa a referência para cada vídeo
    const setVideoRef = (el: HTMLVideoElement | null, index: number) => {
        videoRefs.current[index] = el
    }

    useEffect(() => {
        // Função para tentar dar play nos vídeos
        const playVideos = async () => {
            videoRefs.current.forEach(async (video) => {
                if (video) {
                    try {
                        // Tenta dar play imediatamente
                        await video.play().catch(() => {
                            // Se falhar, tenta novamente na primeira interação
                            const handleFirstInteraction = () => {
                                video.play().catch(console.error)
                                document.removeEventListener('click', handleFirstInteraction)
                                document.removeEventListener('touchstart', handleFirstInteraction)
                            }
                            document.addEventListener('click', handleFirstInteraction)
                            document.addEventListener('touchstart', handleFirstInteraction)
                        })
                    } catch (err) {
                        console.error('Erro ao reproduzir vídeo:', err)
                    }
                }
            })
        }

        // Tenta dar play após um pequeno atraso
        const timer = setTimeout(playVideos, 100)
        return () => clearTimeout(timer)
    }, [])

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
            description: "Insira a chave pix para receber pagamentos de forma rápida. O bananashop é a melhor forma de recebê-los",
            color: "text-[#22C55E]",
        },
        {
            number: 3,
            title: "Traga seus produtos",
            description: "Adicione seus produtos e comece a compartilhar o link na sua bio. Seus clientes podem comprar direto na sua página",
            color: "text-[#22C55E]",
        },
    ]

    return (
        <section className="px-5 py-12 lg:py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 lg:mb-20">
                    <h2 className="font-black italic text-[34px] lg:text-[56px] leading-tight tracking-tighter mb-6 text-black">
                        Comece a vender em 3 passos
                    </h2>
                    <p className="text-[15px] lg:text-[19px] leading-relaxed max-w-2xl mx-auto text-gray-600">
                        Ta na hora dessa lojinha amadurecer! Veja como é fácil começar no Bananashop e automatizar suas vendas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
                    {steps.map((step, index) => (
                        <div key={step.number} className="bg-white border border-gray-100 rounded-[2rem] p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="relative group">
                                <video
                                    ref={(el) => setVideoRef(el, index)}
                                    src={`/video/${step.number}.mp4`}
                                    className="w-full my-4 rounded-2xl shadow-md border border-gray-100 aspect-[4/3] object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="auto"
                                />
                            </div>
                            <div className="flex items-start gap-4 mt-6">
                                <div className={`${step.color} font-serif italic font-black text-[56px] leading-none opacity-40`}>
                                    {step.number}
                                </div>
                                <div className="pt-2">
                                    <h3 className="font-bold text-[20px] mb-2 text-black leading-tight">{step.title}</h3>
                                    <p className="text-[14px] leading-relaxed text-gray-500">{step.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row justify-center items-center mt-20 lg:mt-32 gap-10 lg:gap-20 bg-black rounded-[3rem] p-10 lg:p-20 text-white">
                    <div className="lg:w-1/2">
                        <h2 className="font-black italic text-[34px] lg:text-[56px] leading-[1] tracking-tighter mb-8">
                            Feito pra você vender melhor e mais rápido!
                        </h2>
                        <p className="text-lg opacity-80 mb-10">
                            Dashboard completo para gerenciar seus pedidos, estoque e finanças em um só lugar. Foco no que importa: seu crescimento.
                        </p>
                    </div>

                    <div className="lg:w-1/2 relative group">
                        <div className="absolute -inset-10 bg-green-500/20 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-all"></div>
                        <Image
                            src={"/images/dashboard.png"}
                            alt="Dashboard Preview"
                            width={600}
                            height={600}
                            className="w-full h-auto rounded-2xl shadow-2xl relative z-10 lg:scale-110 transition-transform hover:scale-[1.15]"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}