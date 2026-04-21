import { Control, Controller } from 'react-hook-form';

import { SelectField, type SelectFieldProps } from '../SelectField';

type ControlledSelectFieldProps = Omit<
  SelectFieldProps,
  'value' | 'onValueChange' | 'error'
> & {
  name: string;
  control: Control<any>;
  errors: Record<string, any>;
};

export function ControlledSelectField({
  name,
  control,
  errors,
  ...rest
}: ControlledSelectFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectField
          {...rest}
          value={value}
          onValueChange={onChange}
          error={errors[name]?.message}
        />
      )}
    />
  );
}
