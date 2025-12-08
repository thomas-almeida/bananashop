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
        <section className="px-5 pt-6 pb-0">
            {/* Logo */}
            <div className="flex flex-col justify-center items-center mb-5">
                <Image
                    src={"/logo.png"}
                    width={50}
                    height={50}
                    className=""
                    alt="logo"
                />
                <span className="font-semibold text-[15px]">BananaShop</span>
            </div>

            {/* Hero Content */}
            <div className="flex flex-col justify-center">
                <h1 className="font-bold italic text-[41px] leading-8 tracking-tighter mb-6 text-black text-center my-6">
                    Transforme seu Instagram em uma loja completa
                </h1>

                <p className="text-[15px] leading-4 text-center px-5 mb-4">
                    Uma plataforma onde você pode criar um <strong>linktree</strong> dos seus produtos, permitindo vendas diretas via <strong>PIX</strong>, sem ficar combinando valores na sua DM e perdendo vendas.
                </p>

                <div className="px-10">
                    <GoogleButton
                        text="Traga sua loja hoje!"
                        googleIcon={false}
                        icon={<ArrowRight className="h-4 w-4" />}
                        className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold px-5 py-4 h-auto text-[14px] rounded-lg inline-flex items-center gap-2"
                    />
                </div>
            </div>

            <div className="flex justify-center items-center mt-8 relative">

                <div className="bg-cover w-[400px] flex justify-center items-center relative">
                    <div className="relative">
                        <video
                            ref={videoRef}
                            src="/video/dashboard-video.mp4"
                            loop
                            playsInline
                            muted
                            autoPlay
                            className="w-[350px] rounded-xl border-8 border-slate-950 shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
