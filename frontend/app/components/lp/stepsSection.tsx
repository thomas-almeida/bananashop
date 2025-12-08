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
        <section className="px-5 py-12 bg-white">
            <div className="max-w-md mx-auto">
                <h2 className="font-bold italic text-[34px] leading-7 tracking-tighter mb-6 text-black text-center px-8 my-6">
                    Comece a vender em 3 passos
                </h2>
                <p className="text-[15px] leading-4 text-center px-5 mb-6">
                    Ta na hora dessa lojinha amadurecer! veja como é fácil começar no Bananashop.
                </p>

                <div className="space-y-5">
                    {steps.map((step, index) => (
                        <div key={step.number} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                            <div className="relative">
                                <video
                                    ref={(el) => setVideoRef(el, index)}
                                    src={`/video/${step.number}.mp4`}
                                    className="w-full my-4 rounded-lg shadow-lg border border-slate-300"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="auto"
                                />
                            </div>
                            <div className="flex justify-start items-center gap-4 mt-4">
                                <div className={`${step.color} font-serif italic font-bold text-[56px] leading-none`}>
                                    {step.number}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[18px] mb-2 text-black">{step.title}</h3>
                                    <p className="text-[13px] leading-relaxed text-gray-600">{step.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col justify-center items-center mt-10">
                    <h2 className="font-bold italic text-[34px] leading-7 tracking-tighter mb-6 text-black text-center px-8 my-6">
                        Feito pra você vender melhor e mais rápido!
                    </h2>

                    <Image
                        src={"/images/screenshot.png"}
                        alt=""
                        width={300}
                        height={300}
                        className="w-[350px]"
                    />
                </div>
            </div>
        </section>
    )
}