import { getProductById } from "@/app/service/productService";
import ProductDetail from "./ProductDetail";
import { Metadata } from "next";

type Props = {
    params: Promise<{ productid: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { productid } = await params;
    
    try {
        const response = await getProductById(productid);
        const product = response?.data;
        
        if (!product) return { title: "Produto não encontrado" };

        const firstImage = product.images && product.images.length > 0 ? product.images[0] : '/logo.png';

        return {
            title: `${product.name} | Bananashop`,
            description: product.description,
            openGraph: {
                title: product.name,
                description: product.description,
                images: [{
                    url: firstImage,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                }],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: product.name,
                description: product.description,
                images: [firstImage],
            }
        };
    } catch (error) {
        console.error("Error generating metadata:", error);
        return { title: "Produto | Bananashop" };
    }
}

export default async function Page({ params }: Props) {
    const { productid } = await params;
    let initialProduct = null;
    
    try {
        const response = await getProductById(productid);
        initialProduct = response?.data;
    } catch (e) {
        console.error("Error fetching product on server:", e);
    }

    return <ProductDetail productid={productid} initialProduct={initialProduct} />;
}
