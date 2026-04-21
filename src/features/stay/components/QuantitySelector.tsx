import { View } from 'react-native';

import MinusIcon from '@/assets/icons/minus.svg';
import PlusIcon from '@/assets/icons/plus.svg';
import { AppText } from '@/src/shared/components/AppText';
import { IconButton } from '@/src/shared/components/buttons/IconButton';
import { Colors } from '@/src/shared/theme/colors';

type QuantitySelectorProps = {
  value: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
};

export function QuantitySelector({
  value,
  onChange,
  min = 0,
  max = Infinity,
}: QuantitySelectorProps) {
  return (
    <View className="flex-row items-center justify-between">
      <IconButton
        outlined
        disabled={value <= min}
        onPress={() => {
          if (value > min) {
            onChange(value - 1);
          }
        }}
        Icon={MinusIcon}
      />
      <View className="items-center justify-center w-[50px]">
        <AppText color={Colors.text} size={14} weight="medium">
          {value}
        </AppText>
      </View>
      <IconButton
        outlined
        disabled={value >= max}
        onPress={() => {
          if (value < max) {
            onChange(value + 1);
          }
        }}
        Icon={PlusIcon}
      />
    </View>
  );
}
