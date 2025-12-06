import { z } from "zod"

export const withdrawSchema = z.object({
    value: z.any(),
    userId: z.string(),
    storeId: z.string()
})

export type WithdrawSchema = z.infer<typeof withdrawSchema>

