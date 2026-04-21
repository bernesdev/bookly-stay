import { TFunction } from 'i18next';
import { z } from 'zod';

export const issueCategoryValues = [
  'visualIssue',
  'featureNotWorking',
  'appCrashOrFreeze',
  'performanceIssue',
  'other',
] as const;

export const issueFrequencyValues = ['once', 'sometimes', 'always'] as const;

export const createReportBugSchema = (t: TFunction) =>
  z.object({
    whatWentWrong: z
      .string()
      .trim()
      .min(1, t('profile.validation.whatWentWrongRequired'))
      .max(1000, t('profile.validation.whatWentWrongMax')),
    expectedToHappen: z
      .string()
      .trim()
      .max(1000, t('profile.validation.expectedBehaviorMax'))
      .optional(),
    issueCategory: z
      .union([z.enum(issueCategoryValues), z.literal('')])
      .optional(),
    happenedWhere: z
      .string()
      .trim()
      .max(200, t('profile.validation.locationMax'))
      .optional(),
    issueFrequency: z
      .union([z.enum(issueFrequencyValues), z.literal('')])
      .optional(),
  });

export type ReportBugSchema = z.infer<ReturnType<typeof createReportBugSchema>>;
