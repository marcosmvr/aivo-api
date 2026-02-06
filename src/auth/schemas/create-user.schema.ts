import z from 'zod'

export const CreateUserSchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres.')
    .max(128, 'Senha não pode exceder 128 caracteres.')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Senha deve conter maiúscula, minúscula, número e caractere especial.',
    ),
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres.')
    .max(100, 'Nome não pode exceder 100 caracteres.')
    .trim(),
  role: z.enum(['ADMIN', 'GESTOR']).default('GESTOR'),
})

export type CreateUserSchema = z.infer<typeof CreateUserSchema>
