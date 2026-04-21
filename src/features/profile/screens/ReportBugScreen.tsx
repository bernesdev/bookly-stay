import { useMemo, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard, TextInput, View } from 'react-native';

import { AppScreen } from '@/src/shared/components/AppScreen';
import { AppText } from '@/src/shared/components/AppText';
import { SolidButton } from '@/src/shared/components/buttons/SolidButton';
import { ControlledSelectField } from '@/src/shared/components/fields/controlled/ControlledSelectField';
import { ControlledTextField } from '@/src/shared/components/fields/controlled/ControlledTextField';
import { useLayout } from '@/src/shared/hooks/useLayout';
import { useToast } from '@/src/shared/hooks/useToast';
import { useUserStore } from '@/src/shared/hooks/useUserStore';
import { Colors } from '@/src/shared/theme/colors';

import { useCreateBugReportMutation } from '../api/profile.mutations';
import {
  createReportBugSchema,
  issueCategoryValues,
  issueFrequencyValues,
  type ReportBugSchema,
} from '../schemas/reportBug.schema';

export function ReportBugScreen() {
  const { t } = useTranslation();

  const { bottomOffset } = useLayout();

  const { showToast } = useToast();

  const userId = useUserStore((state) => state.id);

  const { mutate: createBugReport } = useCreateBugReportMutation();

  const expectedToHappenInputRef = useRef<TextInput>(null);

  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ReportBugSchema>({
    resolver: zodResolver(useMemo(() => createReportBugSchema(t), [t])),
    defaultValues: {
      whatWentWrong: '',
      expectedToHappen: '',
      issueCategory: '',
      happenedWhere: '',
      issueFrequency: '',
    },
  });

  const issueCategoryOptions = issueCategoryValues.map((value) => ({
    label: t(`profile.reportBugScreen.issueCategoryOptions.${value}`),
    value,
  }));

  const issueFrequencyOptions = issueFrequencyValues.map((value) => ({
    label: t(`profile.reportBugScreen.issueFrequencyOptions.${value}`),
    value,
  }));

  const handleSendReport = handleSubmit((data) => {
    Keyboard.dismiss();
    setIsLoading(true);

    createBugReport(
      { ...data, userId },
      {
        onSuccess() {
          showToast({
            type: 'success',
            title: t('profile.reportBugScreen.toasts.successTitle'),
            description: t('profile.reportBugScreen.toasts.successDescription'),
          });
          reset();
        },
        onError() {
          showToast({
            type: 'error',
            title: t('profile.reportBugScreen.toasts.errorTitle'),
            description: t('profile.reportBugScreen.toasts.errorDescription'),
          });
        },
        onSettled: () => setIsLoading(false),
      },
    );
  });

  return (
    <AppScreen
      keyboardAvoiding
      preset="scroll"
      appBar={{ title: t('profile.reportBugScreen.appBarTitle') }}
    >
      <View
        className="flex-1 px-6 pt-6"
        style={{ paddingBottom: bottomOffset }}
      >
        <ControlledTextField
          label={t('profile.reportBugScreen.fields.whatWentWrong.label')}
          placeholder={t(
            'profile.reportBugScreen.fields.whatWentWrong.placeholder',
          )}
          name="whatWentWrong"
          control={control}
          errors={errors}
          readOnly={isLoading}
          multiline
          numberOfLines={3}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => expectedToHappenInputRef.current?.focus()}
        />

        <ControlledTextField
          className="mt-6"
          label={t('profile.reportBugScreen.fields.expectedToHappen.label')}
          placeholder={t(
            'profile.reportBugScreen.fields.expectedToHappen.placeholder',
          )}
          name="expectedToHappen"
          control={control}
          errors={errors}
          readOnly={isLoading}
          ref={expectedToHappenInputRef}
          multiline
          numberOfLines={2}
          returnKeyType="done"
          submitBehavior="blurAndSubmit"
        />

        <ControlledSelectField
          className="mt-6"
          label={t('profile.reportBugScreen.fields.issueCategory.label')}
          placeholder={t(
            'profile.reportBugScreen.fields.issueCategory.placeholder',
          )}
          sheetTitle={t(
            'profile.reportBugScreen.fields.issueCategory.sheetTitle',
          )}
          options={issueCategoryOptions}
          name="issueCategory"
          control={control}
          errors={errors}
          readOnly={isLoading}
        />

        <ControlledTextField
          className="mt-6"
          label={t('profile.reportBugScreen.fields.happenedWhere.label')}
          placeholder={t(
            'profile.reportBugScreen.fields.happenedWhere.placeholder',
          )}
          name="happenedWhere"
          control={control}
          errors={errors}
          readOnly={isLoading}
        />

        <ControlledSelectField
          className="mt-6"
          label={t('profile.reportBugScreen.fields.issueFrequency.label')}
          placeholder={t(
            'profile.reportBugScreen.fields.issueFrequency.placeholder',
          )}
          sheetTitle={t(
            'profile.reportBugScreen.fields.issueFrequency.sheetTitle',
          )}
          options={issueFrequencyOptions}
          name="issueFrequency"
          control={control}
          errors={errors}
          readOnly={isLoading}
        />

        <View className="border border-border rounded-xl border-dashed py-3 px-4 mt-6">
          <AppText size={12} color={Colors.text}>
            {t('profile.reportBugScreen.privacyNote.line1')}
          </AppText>
          <AppText size={12} color={Colors.text}>
            {t('profile.reportBugScreen.privacyNote.line2')}
          </AppText>
        </View>

        <View className="mt-auto">
          <SolidButton
            title={t('profile.reportBugScreen.actions.sendReport')}
            onPress={handleSendReport}
            isLoading={isLoading}
            disabled={isLoading}
            className="mt-6"
          />
        </View>
      </View>
    </AppScreen>
  );
}
