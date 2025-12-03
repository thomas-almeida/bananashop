import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    price: z.number().min(0.01, "Considere um preço maior"),
    stock: z.number().min(1, "Estoque deve ser maior que zero"),
    description: z.string().min(1, "Descreva bem seu produto"),
    brand: z.string().optional(),
    images: z.array(z.any()).optional()
});

export type ProductFormData = z.infer<typeof productSchema>;