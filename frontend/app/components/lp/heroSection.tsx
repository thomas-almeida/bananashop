'use client'

import { ArrowRight } from "lucide-react"
import { GoogleButton } from "../ui/GoogleButton"
import Image from "next/image"
import { useRef, useEffect } from "react";

export function HeroSection() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Tenta dar play no vídeo após o carregamento da página
        const playVideo = async () => {
            if (videoRef.current) {
                try {
                    // Tenta dar play imediatamente
                    await videoRef.current.play().catch(() => {
                        // Se falhar, tenta novamente após a primeira interação do usuário
                        const handleFirstInteraction = async () => {
                            await videoRef.current?.play();
                            document.removeEventListener('click', handleFirstInteraction);
                            document.removeEventListener('touchstart', handleFirstInteraction);
                        };
                        document.addEventListener('click', handleFirstInteraction);
                        document.addEventListener('touchstart', handleFirstInteraction);
                    });
                } catch (err) {
                    console.error('Erro ao reproduzir o vídeo:', err);
                }
            }
        };

        // Tenta dar play após um pequeno atraso para garantir que o vídeo esteja pronto
        const timer = setTimeout(playVideo, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="px-5 pt-6 pb-0 lg:pt-16 lg:pb-20 max-w-7xl mx-auto overflow-hidden">
            {/* Logo - Fica no topo e centralizado ou à esquerda no desktop */}
            <div className="flex flex-col lg:flex-row justify-center lg:justify-start items-center mb-10 lg:mb-16 gap-2">
                <Image
                    src={"/logo.png"}
                    width={50}
                    height={50}
                    className="lg:w-12 h-auto"
                    alt="logo"
                />
                <span className="font-bold text-xl lg:text-2xl tracking-tighter">BananaShop</span>
            </div>

            <div className="lg:flex lg:items-center lg:justify-between gap-12">
                {/* Hero Content */}
                <div className="flex flex-col justify-center lg:w-1/2 lg:text-left">
                    <h1 className="font-black italic text-[41px] lg:text-[72px] leading-[0.9] tracking-tighter mb-8 text-black text-center lg:text-left">
                        Venda Qualquer Coisa no <b className="text-green-500">PIX</b> em 3 Minutos
                    </h1>

                    <p className="text-[15px] lg:text-[19px] leading-relaxed text-center lg:text-left px-5 lg:px-0 mb-8 text-gray-600 font-medium">
                        Uma plataforma onde você pode criar um <strong className="text-black">linktree</strong> dos seus produtos, seja para desapegar ou vender produtos novos, chega de anunciar nas redes sociais ou marketplaces que atraem golpistas justo quando você precisa que o dinheiro saia rápido.
                    </p>

                    <div className="px-10 lg:px-0 flex justify-center lg:justify-start">
                        <GoogleButton
                            text="Venda em 3 mintuos"
                            googleIcon={false}
                            icon={<ArrowRight className="h-5 w-5" />}
                            className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold px-8 py-5 h-auto text-[20px] lg:text-[22px] rounded-xl inline-flex items-center gap-3 shadow-xl shadow-green-200 transition-all hover:scale-105"
                        />
                    </div>
                </div>

                {/* Video/Mockup */}
                <div className="flex justify-center items-center mt-12 lg:mt-0 lg:w-1/2 relative">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-green-500/10 rounded-[2.5rem] blur-2xl group-hover:bg-green-500/20 transition-all"></div>
                        <video
                            ref={videoRef}
                            src="/video/dashboard-video.mp4"
                            loop
                            playsInline
                            muted
                            autoPlay
                            className="w-[300px] lg:w-[450px] rounded-3xl border-[10px] lg:border-[16px] border-slate-950 shadow-2xl relative z-10"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
