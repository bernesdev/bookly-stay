import { useRef } from 'react';

import { useRouter } from 'expo-router';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard, TextInput, TouchableOpacity, View } from 'react-native';

import EmailIcon from '@/assets/icons/mail.svg';
import UserIcon from '@/assets/icons/user.svg';
import { AppText } from '@/src/shared/components/AppText';
import { SolidButton } from '@/src/shared/components/buttons/SolidButton';
import { ControlledTextField } from '@/src/shared/components/fields/controlled/ControlledTextField';
import { useToast } from '@/src/shared/hooks/useToast';
import { Colors } from '@/src/shared/theme/colors';

import { useAuth } from '../hooks/useAuth';
import {
  createSignUpSchema,
  type SignUpSchema,
} from '../schemas/signUp.schema';

import { PasswordControlledTextField } from './PasswordControlledTextField';

type SignUpFormProps = {
  onSwitchToSignIn: () => void;
};

export function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
  const { t } = useTranslation();

  const router = useRouter();

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const { showToast } = useToast();
  const { isLoading, signUpWithEmail } = useAuth();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<SignUpSchema>({
    resolver: zodResolver(createSignUpSchema(t)),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const handleSignUp = handleSubmit((data) => {
    Keyboard.dismiss();

    signUpWithEmail({
      ...data,
      onSuccess: () => {
        showToast({
          type: 'success',
          title: t('auth.signUpForm.toasts.successTitle'),
        });
        router.back();
      },
      onError: (error) =>
        showToast({
          type: 'error',
          title: t('auth.signUpForm.toasts.errorTitle'),
          description: error.message,
        }),
    });
  });

  return (
    <View className="w-full">
      <ControlledTextField
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => emailRef.current?.focus()}
        placeholder={t('auth.signUpForm.fields.name')}
        name="name"
        control={control}
        errors={errors}
        PrefixIcon={UserIcon}
        readOnly={isLoading}
      />
      <ControlledTextField
        ref={emailRef}
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordRef.current?.focus()}
        className="mt-6"
        placeholder={t('auth.signUpForm.fields.email')}
        name="email"
        control={control}
        errors={errors}
        PrefixIcon={EmailIcon}
        readOnly={isLoading}
      />
      <PasswordControlledTextField
        ref={passwordRef}
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        className="mt-6"
        placeholder={t('auth.signUpForm.fields.password')}
        name="password"
        control={control}
        errors={errors}
        readOnly={isLoading}
      />
      <PasswordControlledTextField
        ref={confirmPasswordRef}
        className="mt-6"
        placeholder={t('auth.signUpForm.fields.confirmPassword')}
        name="confirmPassword"
        control={control}
        errors={errors}
        readOnly={isLoading}
      />
      <View className="mt-10">
        <SolidButton
          title={t('auth.signUpForm.actions.signUp')}
          onPress={handleSignUp}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </View>
      <TouchableOpacity
        className="mt-8 flex-row justify-center"
        disabled={isLoading}
        onPress={() => {
          Keyboard.dismiss();
          onSwitchToSignIn();
        }}
      >
        <AppText size={14} color={Colors.gray[100]}>
          {t('auth.signUpForm.actions.switchPrefix')}
        </AppText>
        <AppText size={14} weight="medium" color={Colors.primary}>
          {t('auth.signUpForm.actions.switchAction')}
        </AppText>
      </TouchableOpacity>
    </View>
  );
}
