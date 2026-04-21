import { Text, TextProps } from 'react-native';

import type { ColorToken } from '@/src/shared/theme/colors';

type WeightString =
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold';
type WeightNumber = 300 | 400 | 500 | 600 | 700 | 800;

export type Weight = WeightString | WeightNumber;

const weightMap: Record<WeightString, string> = {
  light: 'font-plusJakartaSansLight',
  regular: 'font-plusJakartaSans',
  medium: 'font-plusJakartaSansMedium',
  semibold: 'font-plusJakartaSansSemiBold',
  bold: 'font-plusJakartaSansBold',
  extrabold: 'font-plusJakartaSansExtraBold',
};

const numericWeightMap: Record<WeightNumber, string> = {
  300: 'font-plusJakartaSansLight',
  400: 'font-plusJakartaSans',
  500: 'font-plusJakartaSansMedium',
  600: 'font-plusJakartaSansSemiBold',
  700: 'font-plusJakartaSansBold',
  800: 'font-plusJakartaSansExtraBold',
};

type AppTextProps = TextProps & {
  weight?: Weight;
  size?: number;
  color?: ColorToken;
};

export function AppText({
  weight = 'regular',
  className,
  size,
  color,
  ...props
}: AppTextProps) {
  let fontFamily: string;

  if (typeof weight === 'number') {
    fontFamily = numericWeightMap[weight];
  } else {
    fontFamily = weightMap[weight];
  }

  return (
    <Text
      {...props}
      className={`${fontFamily} ${className ?? ''}`}
      style={{ fontSize: size, color }}
    />
  );
}
