import { ArrowRight } from "lucide-react"
import { GoogleButton } from "../ui/GoogleButton"
import Image from "next/image"

export function HeroSection() {
    return (
        <section className="px-5 pt-6 pb-0">
            {/* Logo */}
            <div className="flex flex-col justify-center items-center mt-10 mb-5">
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
                <h1 className="font-bold italic text-[34px] leading-7 tracking-tighter mb-6 text-black text-center px-8 my-6">
                    Transforme seu Instagram em uma loja completa
                </h1>

                <p className="text-[13px] leading-4 font-medium text-center px-10 mb-4">
                    Em menos de <span className="font-semibold">5 minutos</span>, traga toda geração de vendas na sua bio do
                    Instagram e venda no automático direto no <span className="font-semibold">Pix</span>
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
                    <video
                        src="/video/dashboard-video.mp4"
                        loop
                        autoPlay
                        muted
                        className="w-[350px] rounded-xl border-8 border-slate-950 shadow-lg"
                    />
                    <hr className="border-4 h-[30px] absolute top-16 right-2 rounded-full" />
                    <hr className="border-4 h-[80px] absolute top-30 right-2 rounded-full" />
                </div>
            </div>
        </section>
    )
}
