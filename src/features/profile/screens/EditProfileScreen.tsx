import { useMemo, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard, TextInput, View } from 'react-native';

import EmailIcon from '@/assets/icons/mail.svg';
import UserIcon from '@/assets/icons/user.svg';
import { PasswordControlledTextField } from '@/src/features/auth/components/PasswordControlledTextField';
import { AppScreen } from '@/src/shared/components/AppScreen';
import { SolidButton } from '@/src/shared/components/buttons/SolidButton';
import { ControlledTextField } from '@/src/shared/components/fields/controlled/ControlledTextField';
import { useLayout } from '@/src/shared/hooks/useLayout';
import { useToast } from '@/src/shared/hooks/useToast';
import { useUserStore } from '@/src/shared/hooks/useUserStore';

import { useAuth } from '../../auth/hooks/useAuth';
import {
  createEditProfileSchema,
  type EditProfileSchema,
} from '../schemas/editProfile.schema';

export function EditProfileScreen() {
  const { t } = useTranslation();

  const { bottomOffset } = useLayout();

  const { updateUserProfile, isLoading } = useAuth();

  const { showToast } = useToast();

  const userName = useUserStore((state) => state.name);
  const userEmail = useUserStore((state) => state.email);
  const userAuthProvider = useUserStore((state) => state.provider);

  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<EditProfileSchema>({
    resolver: zodResolver(useMemo(() => createEditProfileSchema(t), [t])),
    defaultValues: {
      name: userName || '',
      email: userEmail || '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSave = handleSubmit(async (data) => {
    Keyboard.dismiss();

    await updateUserProfile({
      name: data.name,
      password: data.password,
      provider: userAuthProvider,
      onSuccess: () => {
        showToast({
          type: 'success',
          title: t('profile.editProfileScreen.toasts.updateSuccessTitle'),
        });
      },
      onError: (error) => {
        showToast({
          type: 'error',
          title: t('profile.editProfileScreen.toasts.errorTitle'),
          description: error.message,
        });
      },
    });
  });

  return (
    <AppScreen
      keyboardAvoiding
      preset="scroll"
      appBar={{ title: t('profile.editProfileScreen.appBarTitle') }}
    >
      <View
        className="flex-1 px-6 pt-6"
        style={{ paddingBottom: bottomOffset }}
      >
        <ControlledTextField
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
          placeholder={t('profile.editProfileScreen.fields.namePlaceholder')}
          name="name"
          control={control}
          errors={errors}
          PrefixIcon={UserIcon}
          readOnly={isLoading}
        />

        <ControlledTextField
          className="mt-6"
          placeholder={t('profile.editProfileScreen.fields.emailPlaceholder')}
          name="email"
          control={control}
          errors={errors}
          PrefixIcon={EmailIcon}
          editable={false}
          selectTextOnFocus={false}
        />

        <PasswordControlledTextField
          ref={passwordRef}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          className="mt-6"
          placeholder={t(
            'profile.editProfileScreen.fields.newPasswordPlaceholder',
          )}
          name="password"
          control={control}
          errors={errors}
          readOnly={isLoading}
          editable={userAuthProvider === 'email'}
        />

        <PasswordControlledTextField
          ref={confirmPasswordRef}
          className="mt-6"
          placeholder={t(
            'profile.editProfileScreen.fields.confirmNewPasswordPlaceholder',
          )}
          name="confirmPassword"
          control={control}
          errors={errors}
          readOnly={isLoading}
          editable={userAuthProvider === 'email'}
        />
        <View className="mt-auto">
          <SolidButton
            title={t('profile.editProfileScreen.actions.save')}
            onPress={handleSave}
            isLoading={isLoading}
            disabled={isLoading}
            className="mt-6"
          />
        </View>
      </View>
    </AppScreen>
  );
}
