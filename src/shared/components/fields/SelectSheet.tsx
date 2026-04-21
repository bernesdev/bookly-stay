import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import CheckIcon from '@/assets/icons/check.svg';
import CloseIcon from '@/assets/icons/x.svg';
import { AppText } from '@/src/shared/components/AppText';
import { IconButton } from '@/src/shared/components/buttons/IconButton';
import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';
import { Colors } from '@/src/shared/theme/colors';

export type SelectOption = {
  label: string;
  value: string;
};

type SelectSheetProps = {
  title?: string;
  options: SelectOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
};

export function SelectSheet({
  title,
  options,
  selectedValue,
  onSelect,
}: SelectSheetProps) {
  const { t } = useTranslation();

  const { hideSheet } = useBottomSheet();

  return (
    <View className="px-6 pt-2 pb-6 flex-1">
      <View className="flex-row justify-between items-center mb-8">
        <AppText size={20} weight="semibold">
          {title ?? t('shared.selectSheet.defaultTitle')}
        </AppText>
        <IconButton Icon={CloseIcon} onPress={hideSheet} />
      </View>

      <View className="flex-1">
        {options.map((option, index) => {
          const isSelected = option.value === selectedValue;
          return (
            <TouchableOpacity
              key={option.value}
              className={`flex-row items-center justify-between py-4 -mx-6 px-6 ${
                index !== options.length - 1
                  ? 'border-b border-gray-300 border-opacity-30'
                  : ''
              }`}
              onPress={() => {
                onSelect(option.value);
                hideSheet();
              }}
            >
              <AppText
                size={14}
                weight={isSelected ? 'medium' : 'regular'}
                color={isSelected ? Colors.text : Colors.gray[100]}
              >
                {option.label}
              </AppText>
              {isSelected && (
                <CheckIcon stroke={Colors.text} width={20} height={20} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
