import ChevronDownIcon from '@/assets/icons/chevron-down.svg';
import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';

import { SelectOption, SelectSheet } from './SelectSheet';
import { TextField, type TextFieldProps } from './TextField';

export type SelectFieldProps = Omit<
  TextFieldProps,
  'value' | 'onChangeText' | 'onPress' | 'SuffixIcon' | 'onSuffixIconPress'
> & {
  options: SelectOption[];
  value?: string;
  sheetTitle?: string;
  onValueChange: (value: string) => void;
};

export function SelectField({
  options,
  value,
  onValueChange,
  sheetTitle,
  editable = true,
  placeholder,
  ...rest
}: SelectFieldProps) {
  const { showSheet } = useBottomSheet();

  const selectedOption = options.find((option) => option.value === value);

  const handleOpenSheet = () => {
    if (!editable) return;

    showSheet(
      <SelectSheet
        title={sheetTitle ?? placeholder}
        options={options}
        selectedValue={value}
        onSelect={onValueChange}
      />,
      { showHandleIndicator: false },
    );
  };

  return (
    <TextField
      {...rest}
      editable={editable}
      readOnly={editable}
      placeholder={placeholder}
      value={selectedOption?.label ?? ''}
      onPress={editable ? handleOpenSheet : undefined}
      SuffixIcon={ChevronDownIcon}
      onSuffixIconPress={editable ? handleOpenSheet : undefined}
    />
  );
}
