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
                        Obrigado!
                    </h1>
                    <p className="max-w-xs text-lg text-zinc-600 leading-5 mt-4">
                        Obrigado por sua compra! em instantes a loja entrará em contato com você. também enviamos a confirmação do seu pedido via e-mail e whatsapp, fique de olho.
                    </p>
                </div>
            </main>
        </div>
    )
}