import { z } from "zod";

export const storeSchema = z.object({
    storeName: z.string().min(2, "Campo obrigatório"),
    description: z.string().min(5, "Campo obrigatório"),
    instagram: z.string().min(1, "Campo obrigatório"),
    whatsapp: z.string().min(1, "Campo obrigatório"),
    logo: z
        .any()
        .refine(
            (file) => {
                // Se for string (base64), aceita
                if (typeof file === 'string') return true;
                // Se for File, verifica o tamanho
                if (file instanceof File) {
                    return file.size <= 2 * 1024 * 1024;
                }
                // Se não for nenhum dos dois, rejeita
                return false;
            },
            "O arquivo deve ter até 2MB"
        )
        .optional(),
});

export const productsSchema = z.object({
    csvFile: z.any().optional(),
    products: z.array(
        z.object({
            name: z.string().min(1),
            price: z.number().positive(),
            description: z.string().optional(),
        })
    ).optional(),
});

export const bankingSchema = z.object({
    taxID: z.string().min(11, "CPF inválido"),
    pixKey: z.string().min(5, "Campo obrigatório"),
    payoutMethod: z.enum(["IMEDIATO", "SEMANAL", "MENSAL"]),
});

export const fullSchema = storeSchema.merge(productsSchema).merge(bankingSchema);
