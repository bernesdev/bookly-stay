import { useState } from 'react';

import { Control, FieldErrors, FieldValues, Path } from 'react-hook-form';

import EyeOffIcon from '@/assets/icons/eye-slash.svg';
import EyeIcon from '@/assets/icons/eye.svg';
import LockIcon from '@/assets/icons/lock.svg';
import { ControlledTextField } from '@/src/shared/components/fields/controlled/ControlledTextField';
import { TextFieldProps } from '@/src/shared/components/fields/TextField';

type PasswordControlledTextFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
} & Omit<
  TextFieldProps,
  'PrefixIcon' | 'SuffixIcon' | 'onSuffixIconPress' | 'secureTextEntry'
>;

export function PasswordControlledTextField<TFieldValues extends FieldValues>({
  name,
  control,
  errors,
  editable,
  ...rest
}: PasswordControlledTextFieldProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ControlledTextField
      {...rest}
      name={name}
      control={control}
      errors={errors}
      PrefixIcon={LockIcon}
      SuffixIcon={showPassword ? EyeOffIcon : EyeIcon}
      secureTextEntry={!showPassword}
      editable={editable}
      onSuffixIconPress={() => {
        if (editable === false) return;
        setShowPassword((prevState) => !prevState);
      }}
    />
  );
}
