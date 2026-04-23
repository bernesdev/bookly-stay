module.exports = {
  expo: {
    name: 'Bookly Stay',
    slug: 'Bookly',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'bookly',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      bundleIdentifier: 'dev.bernes.bookly',
      buildNumber: '1',
      googleServicesFile:
        process.env.GOOGLE_SERVICES_INFO_PLIST ??
        './credentials/firebase/GoogleService-Info.plist',
      supportsTablet: true,
      usesAppleSignIn: true,
    },
    android: {
      package: 'dev.bernes.bookly',
      versionCode: 4,
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ??
        './credentials/firebase/google-services.json',
      adaptiveIcon: {
        backgroundColor: '#5569A6',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
      },
      predictiveBackGestureEnabled: false,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      '@react-native-firebase/app',
      '@react-native-firebase/auth',
      '@react-native-firebase/crashlytics',
      '@react-native-google-signin/google-signin',
      'expo-maps',
      'expo-apple-authentication',
      'expo-localization',
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
            buildReactNativeFromSource: true,
          },
        },
      ],
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Bookly needs your location to find the best hotels near you.',
        },
      ],
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#5569A6',
          dark: {
            backgroundColor: '#5569A6',
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      eas: {
        projectId: '059e96cb-a3df-4564-b6f1-21e93cdd8965',
      },
    },
  },
};
