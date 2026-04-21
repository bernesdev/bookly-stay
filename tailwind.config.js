/** @type {import('tailwindcss').Config} */
const plusJakarta = (weight) => [`PlusJakartaSans-${weight}`, 'sans-serif'];

module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5569A6',
        secondary: '#404055',
        accent: {
          100: '#A7352A',
          200: '#F4C700',
        },
        state: {
          success: '#2E7D5B',
          error: '#D14343',
          warning: '#F4C700',
          info: '#5569A6',
        },
        background: '#F5F7FB',
        text: '#282837',
        border: '#E9EBED',
        black: '#000000',
        white: '#FCFCFC',
        gray: {
          100: '#7F7F7F',
          200: '#BABABA',
          300: '#F3F3F3',
          400: '#F6F6F6',
        },
      },
      fontFamily: {
        plusJakartaSans: plusJakarta('Regular'),
        plusJakartaSansLight: plusJakarta('Light'),
        plusJakartaSansMedium: plusJakarta('Medium'),
        plusJakartaSansSemiBold: plusJakarta('SemiBold'),
        plusJakartaSansBold: plusJakarta('Bold'),
        plusJakartaSansExtraBold: plusJakarta('ExtraBold'),
      },
    },
  },
  plugins: [],
};
