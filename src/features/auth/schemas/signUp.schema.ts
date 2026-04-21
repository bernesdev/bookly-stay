import { TFunction } from 'i18next';
import { z } from 'zod';

export const createSignUpSchema = (t: TFunction) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(2, t('auth.validation.nameMin'))
        .max(80, t('auth.validation.nameMax')),
      email: z.email(t('auth.validation.invalidEmail')),
      password: z
        .string()
        .min(6, t('auth.validation.passwordMin'))
        .max(128, t('auth.validation.passwordMax')),
      confirmPassword: z
        .string()
        .min(1, t('auth.validation.confirmPasswordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('auth.validation.passwordsDoNotMatch'),
    });

export type SignUpSchema = z.infer<ReturnType<typeof createSignUpSchema>>;
