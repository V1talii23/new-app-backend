import {z} from "zod"

export const registerSchema = z.object({
    email: z.email(),
    name:z.string().min(3),
    password:z.string().min(8)
}) 

export const requestResetEmailSchema = z.object({
    email: z.email(),
})

export const resetPasswordSchema = z.object({
    token: z.string(),
    password:z.string().min(8)
})
