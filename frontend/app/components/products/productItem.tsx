import Image from "next/image"
import { Images } from "lucide-react";
import Button from "@/app/components/form/Button";
import Link from "next/link";

export default function ProductItem({ product }: { product: any }) {
    return (
        <Link
            href={`/loja/produto/${product?._id}`}
            className="border border-slate-200 shadow p-4 cursor-pointer"
        >
            <div className="flex flex-col justify-start items-start">
                <div className="relative">
                    <Image
                        src={product?.images[0]}
                        alt={product?.name || 'Product image'}
                        width={300}
                        height={300}
                        className="object-cover shadow rounded-md border border-slate-200"
                    />
                    {
                        product?.images?.length > 1 && (
                            <Images className="w-7 h-7 text-white absolute top-4 right-4 bg-black/50 rounded p-1" />
                        )
                    }
                </div>
                <div className="mt-2 w-full">
                    <h2 className="text-xl">{product?.name}</h2>
                    <p className="text-sm text-gray-600">{product?.description}</p>
                    <h3 className="text-2xl font-semibold">{product?.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                    <Button
                        text="Comprar Agora no PIX"
                        color="primary"
                        className="px-4 w-full mt-4"
                    />
                </div>
            </div>
        </Link>
    )
}