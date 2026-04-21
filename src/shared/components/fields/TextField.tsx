import { useRef } from 'react';

import {
  TextInput,
  TextInputProps,
  View,
  Pressable,
  Platform,
} from 'react-native';
import Animated, {
  FadeInUp,
  FadeOutUp,
  LinearTransition,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SvgProps } from 'react-native-svg/lib/typescript/elements/Svg';

import { Colors } from '@/src/shared/theme/colors';

import { AppText } from '../AppText';
import { IconButton } from '../buttons/IconButton';

export type TextFieldProps = TextInputProps & {
  PrefixIcon?: React.FC<SvgProps>;
  SuffixIcon?: React.FC<SvgProps>;
  onSuffixIconPress?: () => void;
  onPrefixIconPress?: () => void;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  ref?: React.Ref<TextInput>;
  className?: string;
  error?: string;
  onPress?: () => void;
  label?: string;
};

export function TextField({
  PrefixIcon,
  SuffixIcon,
  onSuffixIconPress,
  onPrefixIconPress,
  placeholder,
  ref,
  className,
  error,
  editable = true,
  readOnly = false,
  onFocus,
  onBlur,
  onPress,
  label,
  ...rest
}: TextFieldProps) {
  const previousErrorRef = useRef(error);
  const hasText = Boolean(rest.value);
  const focusProgress = useSharedValue(0);
  const isMultiline = rest.multiline || (rest.numberOfLines ?? 1) > 1;
  const multilineHeight = Math.max(50, (rest.numberOfLines ?? 1) * 22 + 24);

  const shouldAnimateLayout = previousErrorRef.current !== error;
  previousErrorRef.current = error;

  const handleFocus: TextInputProps['onFocus'] = (event) => {
    focusProgress.value = withTiming(1, { duration: 200 });
    onFocus?.(event);
  };

  const handleBlur: TextInputProps['onBlur'] = (event) => {
    focusProgress.value = withTiming(0, { duration: 200 });
    onBlur?.(event);
  };

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      [Colors.gray[100], Colors.secondary],
    ),
  }));

  const iconColor = editable || readOnly ? Colors.gray[100] : Colors.gray[200];

  return (
    <Animated.View
      layout={shouldAnimateLayout ? LinearTransition.duration(220) : undefined}
      className={`w-full ${className}`}
    >
      {label && (
        <AppText size={14} weight="medium" className="mb-3">
          {label}
        </AppText>
      )}
      <Animated.View
        style={[
          editable ? animatedBorderStyle : { borderColor: Colors.gray[200] },
          isMultiline ? { height: multilineHeight } : undefined,
        ]}
        className={`${isMultiline ? 'bg-white border-[1px] rounded-xl justify-start w-full flex-row px-4 py-3 z-10' : 'h-[50px] bg-white border-[1px] rounded-xl justify-center items-center w-full flex-row px-4 z-10'}`}
      >
        {PrefixIcon && (
          <IconButton
            Icon={PrefixIcon}
            iconSize={20}
            iconColor={iconColor}
            onPress={onPrefixIconPress}
            disabled={!editable && !readOnly}
            className="mr-2"
          />
        )}

        <View
          className={`flex-1 ${isMultiline ? 'min-h-full justify-start' : 'h-full justify-center'}`}
        >
          <View
            className={`absolute inset-0 ${isMultiline ? 'justify-start' : 'justify-center'}`}
          >
            <AppText
              className={`pointer-events-none ${hasText ? 'opacity-0' : ''}`}
              color={editable ? Colors.gray[100] : Colors.gray[200]}
              size={14}
              style={{ ...Platform.select({ android: { marginLeft: 8 } }) }}
            >
              {placeholder}
            </AppText>
          </View>
          <TextInput
            ref={ref}
            className={`font-plusJakartaSans text-[14px] flex-1 ${isMultiline ? 'py-0' : ''} ${editable || readOnly ? 'text-text' : 'text-gray-200'}`}
            cursorColor={Colors.primary}
            editable={editable}
            readOnly={readOnly || !editable}
            textAlignVertical={isMultiline ? 'top' : 'center'}
            onFocus={handleFocus}
            onBlur={handleBlur}
            pointerEvents={onPress ? 'none' : 'auto'}
            {...rest}
          />
          {onPress && (
            <Pressable className="absolute inset-0" onPress={onPress} />
          )}
        </View>

        {SuffixIcon && (
          <IconButton
            onPress={onSuffixIconPress}
            Icon={SuffixIcon}
            iconSize={20}
            iconColor={iconColor}
            disabled={!editable && !readOnly}
            className="ml-2"
          />
        )}
      </Animated.View>

      {error && (
        <Animated.View
          layout={LinearTransition.duration(220)}
          entering={FadeInUp.duration(220)}
          exiting={FadeOutUp.duration(220)}
        >
          <AppText className="mt-1" size={12} color={Colors.state.error}>
            {error}
          </AppText>
        </Animated.View>
      )}
    </Animated.View>
  );
}
