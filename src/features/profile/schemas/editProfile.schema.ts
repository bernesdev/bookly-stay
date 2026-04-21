import { TFunction } from 'i18next';
import { z } from 'zod';

export const createEditProfileSchema = (t: TFunction) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(2, t('profile.validation.nameMin'))
        .max(80, t('profile.validation.nameMax')),
      email: z.email(t('profile.validation.invalidEmail')),
      password: z.string().optional(),
      confirmPassword: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.password) return data.password === data.confirmPassword;
        return true;
      },
      {
        message: t('profile.validation.passwordsDoNotMatch'),
        path: ['confirmPassword'],
      },
    )
    .refine(
      (data) => {
        if (data.password) return data.password.length >= 6;
        return true;
      },
      {
        message: t('profile.validation.passwordMin'),
        path: ['password'],
      },
    )
    .refine(
      (data) => {
        if (data.password) return data.password.length <= 128;
        return true;
      },
      {
        message: t('profile.validation.passwordMax'),
        path: ['password'],
      },
    );

export type EditProfileSchema = z.infer<
  ReturnType<typeof createEditProfileSchema>
>;
