import { useRef } from 'react';

import { useRouter } from 'expo-router';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AppleIcon from '@/assets/icons/apple.svg';
import GoogleIcon from '@/assets/icons/google.svg';
import EmailIcon from '@/assets/icons/mail.svg';
import { AppError } from '@/src/core/errors/app.error';
import { AppText } from '@/src/shared/components/AppText';
import { SolidButton } from '@/src/shared/components/buttons/SolidButton';
import { TextButton } from '@/src/shared/components/buttons/TextButton';
import { ControlledTextField } from '@/src/shared/components/fields/controlled/ControlledTextField';
import { useToast } from '@/src/shared/hooks/useToast';
import { Colors } from '@/src/shared/theme/colors';

import { useAuth } from '../hooks/useAuth';

import { PasswordControlledTextField } from './PasswordControlledTextField';
import { SocialButton } from './SocialButton';

type SignInFormProps = {
  onSwitchToSignUp: () => void;
};

export function SignInForm({ onSwitchToSignUp }: SignInFormProps) {
  const { t } = useTranslation();

  const router = useRouter();
  const passwordRef = useRef<TextInput>(null);

  const { showToast } = useToast();
  const { isLoading, signInWithApple, signInWithEmail, signInWithGoogle } =
    useAuth();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const handleSuccess = () => {
    showToast({
      type: 'success',
      title: t('auth.signInForm.toasts.successTitle'),
    });
    router.back();
  };

  const handleError = (error: AppError) =>
    showToast({
      type: 'error',
      title: t('auth.signInForm.toasts.errorTitle'),
      description: error.message,
    });

  const handleSignInWithGoogle = () =>
    signInWithGoogle({ onSuccess: handleSuccess, onError: handleError });

  const handleSignInWithApple = () =>
    signInWithApple({ onSuccess: handleSuccess, onError: handleError });

  const handleSignInWithMail = handleSubmit((data) => {
    Keyboard.dismiss();

    if (data.email === '' || data.password === '') return;

    signInWithEmail({
      ...data,
      onSuccess: handleSuccess,
      onError: handleError,
    });
  });

  return (
    <View className="w-full">
      <ControlledTextField
        placeholder={t('auth.signInForm.fields.email')}
        name="email"
        control={control}
        errors={errors}
        PrefixIcon={EmailIcon}
        readOnly={isLoading}
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <PasswordControlledTextField
        ref={passwordRef}
        className="mt-6"
        placeholder={t('auth.signInForm.fields.password')}
        name="password"
        control={control}
        errors={errors}
        readOnly={isLoading}
      />
      <TextButton onPress={() => {}} className="mt-6 ml-auto">
        {t('auth.signInForm.actions.forgotPassword')}
      </TextButton>
      <View className="mt-10">
        <SolidButton
          title={t('auth.signInForm.actions.signIn')}
          onPress={handleSignInWithMail}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </View>
      <View className="mt-12 flex-row justify-center">
        <SocialButton Icon={GoogleIcon} onPress={handleSignInWithGoogle} />
        {Platform.OS === 'ios' && (
          <SocialButton
            Icon={AppleIcon}
            onPress={handleSignInWithApple}
            className="ml-4"
          />
        )}
      </View>
      <TouchableOpacity
        className="mt-8 flex-row justify-center"
        disabled={isLoading}
        onPress={() => {
          Keyboard.dismiss();
          onSwitchToSignUp();
        }}
      >
        <AppText size={14} color={Colors.gray[100]}>
          {t('auth.signInForm.actions.switchPrefix')}
        </AppText>
        <AppText size={14} weight="medium" color={Colors.primary}>
          {t('auth.signInForm.actions.switchAction')}
        </AppText>
      </TouchableOpacity>
    </View>
  );
}
