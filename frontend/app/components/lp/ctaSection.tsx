import { ArrowRight } from "lucide-react"
import { GoogleButton } from "../ui/GoogleButton"

export function CtaSection() {
    return (
        <section className="px-5 py-12 bg-white">
            <div className="max-w-md mx-auto text-center">
                <h2 className="font-bold italic text-[34px] leading-7 tracking-tighter mb-6 text-black text-center px-8 my-6">
                    Pronto pra vender no automático ?
                </h2>

                <div className="px-10">
                    <GoogleButton
                        text="Traga sua loja hoje!"
                        googleIcon={false}
                        icon={<ArrowRight className="h-4 w-4" />}
                        className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold px-5 py-2.5 h-auto text-[14px] rounded-lg inline-flex items-center gap-2"
                    />
                </div>
            </div>
        </section>
    )
}
