import Input from "../form/Input";
import { Tag, DollarSign, Landmark, Box, Plus } from "lucide-react"
import ImageUploadCarousel from "../ImageUploadCarousel";
import { useState } from "react";
import Button from "../form/Button";
import { productSchema } from "@/app/dashboard/products/schemas/productSchema";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProduct, createProductPayload } from "@/app/service/productService";
import { uploadImage } from "@/app/service/uploadService";
import { useProducts } from "@/hooks/use-products";

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    storeId: string;
}

type ProductFormData = z.infer<typeof productSchema>

export default function CreateProductModal({ isOpen, onClose, storeId }: CreateProductModalProps) {
    if (!isOpen) return null;

    const [images, setImages] = useState<File[]>([])
    const [isFetching, setIsFetching] = useState(false)
    const { refetch } = useProducts();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {}
    })

    const onSubmit = async (data: ProductFormData) => {
        if (!images.length) {
            alert('Por favor, adicione pelo menos uma imagem do produto');
            return;
        }

        setIsFetching(true);

        try {
            // Fazer upload de cada imagem
            const imageUploadPromises = images.map(file => {
                return uploadImage(file);
            });

            // Aguardar todos os uploads terminarem
            const uploadResults = await Promise.all(imageUploadPromises);

            // Extrair as URLs das imagens
            const imageUrls = uploadResults.map(result => result.imageUrl);

            // Criar o produto com as URLs das imagens
            const productData: createProductPayload = {
                name: data.name,
                price: Number(data.price),
                description: data.description,
                stock: Number(data.stock),
                ...(data.brand && { brand: data.brand }),
                images: imageUrls
            };

            await createProduct(storeId, productData);

            // Fechar o modal e limpar o formulário
            onClose();
            setImages([]);
            alert("Produto criado com sucesso!")
            refetch();
        
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            alert('Ocorreu um erro ao criar o produto. Por favor, tente novamente.');
        } finally {
            setIsFetching(false);
        }
    }

    // Função para fechar o modal ao clicar fora do conteúdo
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Previne que o clique dentro do modal feche-o
    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 bg-black/45 flex justify-center items-end z-50 transition-opacity duration-300"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white w-full max-w-2xl max-h-[85%] rounded-t-2xl p-6 animate-slide-up overflow-y-auto"
                onClick={handleModalClick}
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Criar Produto</h1>
                        <p className="text-gray-500">Insira as informações do seu produto abaixo</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Fechar modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="py-4">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="grid grid-cols-1 gap-4"
                    >

                        {/* Carrossel de Imagens */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Imagens do Produto
                            </label>
                            <ImageUploadCarousel
                                onImagesChange={setImages}
                                {...register("images")}
                                maxImages={5}
                            />
                        </div>

                        <Input
                            placeholder="Nome do produto"
                            type="text"
                            icon={<Box className="h-6 w-6 text-gray-400" />}
                            {...register("name")}
                            className={errors.name && "border border-red-300"}
                        />
                        <Input
                            placeholder="Preço (R$)"
                            type="number"
                            step="0.01"
                            icon={<DollarSign className="h-6 w-6 text-gray-400" />}
                            {...register("price", { valueAsNumber: true })}
                            className={errors.price && "border border-red-300"}
                        />
                        <Input
                            placeholder="Marca (Opcional)"
                            type="text"
                            icon={<Tag className="h-6 w-6 text-gray-400" />}
                            {...register("brand")}
                            className={errors.brand && "border border-red-300"}
                        />
                        <Input
                            placeholder="Em estoque"
                            type="number"
                            icon={<Landmark className="h-6 w-6 text-gray-400" />}
                            {...register("stock", { valueAsNumber: true })}
                            className={errors.stock && "border border-red-300"}
                        />
                        <textarea
                            placeholder="Descrição do produto"
                            className={`${errors.description && "border-red-300"} w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            rows={4}
                            {...register("description")}
                        />
                        <Button
                            type="submit"
                            text={isFetching ? "Criando..." : "Criar Produto"}
                            color="primary"
                            loading={isFetching}
                            icon={<Plus />}
                        />

                    </form>
                </div>
            </div>
        </div>
    );
}