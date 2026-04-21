import { Control, Controller } from 'react-hook-form';
import { TextInput } from 'react-native';

import { TextField, type TextFieldProps } from '../TextField';

type ControlledTextFieldProps = TextFieldProps & {
  name: string;
  control: Control<any>;
  errors: Record<string, any>;
  ref?: React.Ref<TextInput>;
};

export function ControlledTextField({
  name,
  control,
  errors,
  ref,
  ...rest
}: ControlledTextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextField
          {...rest}
          onChangeText={onChange}
          onBlur={onBlur}
          value={value}
          ref={ref}
          error={errors[name]?.message}
        />
      )}
    />
  );
}
