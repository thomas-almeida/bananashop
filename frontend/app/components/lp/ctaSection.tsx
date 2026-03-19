import { ArrowRight } from "lucide-react"
import { GoogleButton } from "../ui/GoogleButton"

export function CtaSection() {
    return (
        <section className="px-5 py-20 lg:py-32 bg-white">
            <div className="max-w-4xl mx-auto text-center bg-gray-900 rounded-[3rem] p-10 lg:p-20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"></div>
                
                <h2 className="font-black italic text-[34px] lg:text-[64px] leading-tight tracking-tighter mb-10 text-white relative z-10">
                    Pronto pra vender no automático?
                </h2>

                <div className="flex justify-center relative z-10">
                    <GoogleButton
                        text="Traga sua loja hoje!"
                        googleIcon={false}
                        icon={<ArrowRight className="h-6 w-6" />}
                        className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold px-10 py-5 h-auto text-[18px] lg:text-[20px] rounded-xl inline-flex items-center gap-3 shadow-xl shadow-green-900/40 transition-all hover:scale-105"
                    />
                </div>
            </div>
        </section>
    )
}
