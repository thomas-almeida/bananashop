import Image from "next/image";
import { GoogleButton } from "./components/ui/GoogleButton";

export default function Home() {
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
            BananaShop
          </h1>
          <p className="max-w-xs text-lg text-zinc-600 leading-5 mt-4">
            Amadureça suas vendas, conecte sua loja em apenas <b>2 minutos!</b>
          </p>
          <div className="mt-5">
            <GoogleButton text="Comece Grátis sem Cartão" />
          </div>
        </div>
      </main>
    </div>
  );
}
