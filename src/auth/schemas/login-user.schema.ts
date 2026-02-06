import z from 'zod'

export const SignInUserSchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(1, 'Senha é obrigatória.'),
})

export type SignInUserSchema = z.infer<typeof SignInUserSchema>
