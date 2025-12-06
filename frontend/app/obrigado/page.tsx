import Image from "next/image"

export default function ThanksPage() {
    return (
        <div className="flex h-[75vh] items-center justify-center font-sans">
            <main className="flex w-full flex-col items-center justify-center">
                <div className="flex flex-col items-center text-center">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={100}
                        height={24}
                        priority
                    />
                    <h1 className="max-w-xs text-3xl font-semibold tracking-tight">
                        Obrigado pela compra!
                    </h1>
                    <div className="mx-5 text-center">
                        <p className="text-lg text-zinc-900 leading-5 mt-4">
                            Verifique seu e-mail pois te enviamos o comprovante por lá! A loja já está ciente do seu pedido e entrará em contato com você em instantes.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}