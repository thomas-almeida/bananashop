import Image from "next/image"
import { Images } from "lucide-react";
import Button from "@/app/components/form/Button";
import Link from "next/link";

export default function ProductItem({ product }: { product: any }) {
    return (
        <Link
            href={`/loja/produto/${product?._id}`}
            className="border border-slate-200 shadow p-2 cursor-pointer rounded flex flex-col h-full bg-white"
        >
            <div className="flex md:flex-col justify-start items-start gap-3 flex-1">
                <div className="relative flex-shrink-0 w-32 h-32 md:w-full md:aspect-square">
                    <Image
                        src={product?.images[0]}
                        alt={product?.name || 'Product image'}
                        fill
                        className="object-cover shadow-sm rounded-md border border-slate-200"
                    />
                    {
                        product?.images?.length > 1 && (
                            <Images className="w-6 h-6 text-white absolute top-2 right-2 bg-black/50 rounded p-1" />
                        )
                    }
                </div>
                <div className="w-full">
                    <h2 className="text-2xl font-semibold tracking-tighter leading-tight line-clamp-2 pb-1">{product?.name}</h2>
                    <p className={`pb-1 text-${product?.inStorage > 0 ? "green-500 font-semibold" : "neutral-700 font-semibold"}`}>{product?.inStorage > 0 ? "Disponível" : "Esgotado"}</p>
                    <p className="text-sm text-gray-600 line-clamp-3 md:line-clamp-4 leading-tight">
                        {product?.description}
                    </p>
                    <h3 className="text-3xl font-semibold py-2">{product?.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                </div>
            </div>
            <Button
                text="Comprar Agora no PIX"
                color="primary"
                className="px-2 md:px-4 w-full mt-4 text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis"
                icon={<Image src={"/pix.png"} width={20} height={20} alt="pix" />}
            />
        </Link>
    )
}