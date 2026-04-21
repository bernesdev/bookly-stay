import { useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native';

import SearchIcon from '@/assets/icons/search.svg';
import CloseIcon from '@/assets/icons/x.svg';
import { ControlledTextField } from '@/src/shared/components/fields/controlled/ControlledTextField';

import { locationKeys } from '../api/location.keys';
import { SearchInputOptionsValues } from '../types';

type SearchFieldProps = {
  form: UseFormReturn<SearchInputOptionsValues, any, SearchInputOptionsValues>;
};

export function SearchField({
  form: {
    setValue,
    control,
    formState: { errors },
  },
}: SearchFieldProps) {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const inputRef = useRef<TextInput>(null);

  const location = useWatch({ control, name: 'location' });

  return (
    <ControlledTextField
      className="mt-6"
      ref={inputRef}
      placeholder={t('location.searchField.placeholder')}
      name="location"
      control={control}
      errors={errors}
      PrefixIcon={SearchIcon}
      SuffixIcon={location?.length > 0 ? CloseIcon : undefined}
      onSuffixIconPress={() => {
        setValue('location', '');
        inputRef.current?.blur();
        queryClient.cancelQueries({ queryKey: locationKeys.all });
      }}
    />
  );
}
