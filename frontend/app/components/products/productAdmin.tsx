import Image from "next/image"
import { Eye, SquarePen } from "lucide-react"
import Link from "next/link"

interface ProductAdminProps {
    product: any
}

export default function ProductAdmin({ product }: ProductAdminProps) {

    return (
        <>
            <div
                className="relative border border-slate-200 p-4 rounded shadow space-y-4"
            >
                <div className="flex justify-start items-center gap-4">
                    <div className="shrink-0">
                        <Image
                            src={product.images[0]}
                            width={100}
                            height={100}
                            alt={product.description}
                            className="shadow-md rounded border border-slate-200"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">{product.name}</h3>
                        <p className="text-md text-neutral-600 font-medium">R$ {product.price.toFixed(2)}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-4 border border-slate-200 rounded-md shadow bg-[#22C55E] text-white">
                        <Link href={`/loja/produto/${product?._id}`}>
                            <Eye className="w-4 h-4 mr-2 inline" />
                            Ver Produto
                        </Link>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-md shadow">
                        <SquarePen className="w-4 h-4 mr-2 inline" />
                        Editar
                    </div>
                </div>
            </div>
        </>
    )

}