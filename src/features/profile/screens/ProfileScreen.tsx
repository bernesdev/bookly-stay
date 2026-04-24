import Constants from 'expo-constants';
import { useRouter } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { Linking, Platform, TouchableOpacity, View } from 'react-native';

import GithubIcon from '@/assets/icons/github.svg';
import LinkedinIcon from '@/assets/icons/linkedin.svg';
import LoginIcon from '@/assets/icons/login.svg';
import LogoutIcon from '@/assets/icons/logout.svg';
import UserIcon from '@/assets/icons/user.svg';
import { UnauthenticatedSheet } from '@/src/features/auth/components/UnauthenticatedSheet';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { AppScreen } from '@/src/shared/components/AppScreen';
import { AppText } from '@/src/shared/components/AppText';
import { IconButton } from '@/src/shared/components/buttons/IconButton';
import { useBottomSheet } from '@/src/shared/hooks/useBottomSheet';
import { useToast } from '@/src/shared/hooks/useToast';
import { useUserStore } from '@/src/shared/hooks/useUserStore';
import {
  selectUserName,
  selectUserNameInitials,
} from '@/src/shared/selectors/user.selectors';
import { Colors } from '@/src/shared/theme/colors';

import { ProfileButton } from '../components/ProfileButton';

export function ProfileScreen() {
  const { t } = useTranslation();

  const { showSheet } = useBottomSheet();

  const router = useRouter();

  const isUserLoggedIn = useUserStore((state) => state.isLoggedIn);
  const userEmail = useUserStore((state) => state.email);
  const userName = useUserStore(selectUserName);
  const userNameInitials = useUserStore(selectUserNameInitials);

  const { signOut } = useAuth();
  const { showToast } = useToast();

  const version = Constants.expoConfig?.version;

  const buildNumber = Platform.select({
    ios: Constants.expoConfig?.ios?.buildNumber,
    android: Constants.expoConfig?.android?.versionCode?.toString(),
  });

  const handleAuth = () => {
    if (isUserLoggedIn) {
      signOut();
      showToast({
        type: 'success',
        title: t('profile.profileScreen.toasts.signOutSuccess'),
      });
    } else {
      router.push('/auth');
    }
  };

  return (
    <AppScreen
      preset="fixed"
      appBar={{
        title: t('profile.profileScreen.appBarTitle'),
        showLeading: false,
      }}
    >
      <View className="flex-row gap-5 items-center mt-6 px-6">
        <View className="w-[65px] h-[65px] rounded-full bg-primary items-center justify-center">
          {isUserLoggedIn ? (
            <AppText size={22} color={Colors.white} weight="bold">
              {userNameInitials}
            </AppText>
          ) : (
            <UserIcon width={28} height={28} stroke={Colors.white} />
          )}
        </View>
        <View>
          <AppText size={16} weight="medium">
            {userName}
          </AppText>
          <AppText size={12} color={Colors.gray[100]} className="mt-2">
            {userEmail ?? t('profile.profileScreen.signInToAccount')}
          </AppText>
        </View>
      </View>

      <View className="mt-8 border-t border-border" />

      {isUserLoggedIn && (
        <View>
          <AppText
            size={14}
            weight="medium"
            color={Colors.gray[100]}
            className="px-6 my-7"
          >
            {t('profile.profileScreen.sections.account')}
          </AppText>
          <ProfileButton
            title={t('profile.profileScreen.actions.editProfile')}
            onPress={() => {
              if (isUserLoggedIn) {
                router.push('/edit-profile');
              }
            }}
          />
          <ProfileButton
            title={t('profile.profileScreen.actions.deleteAccount')}
            onPress={() => {
              if (isUserLoggedIn) {
                Linking.openURL('https://forms.gle/B146NgcPA1fFiqpn9');
              }
            }}
          />
        </View>
      )}

      <AppText
        size={14}
        weight="medium"
        color={Colors.gray[100]}
        className="px-6 my-7"
      >
        {t('profile.profileScreen.sections.support')}
      </AppText>

      <ProfileButton
        title={t('profile.profileScreen.actions.reportBug')}
        onPress={() => {
          if (isUserLoggedIn) {
            router.push('/report-bug');
            return;
          }

          if (!isUserLoggedIn) {
            showSheet(
              <UnauthenticatedSheet
                title={t('profile.profileScreen.unauthenticatedSheetTitle')}
              />,
              { showHandleIndicator: false },
            );
          }
        }}
      />

      <TouchableOpacity
        className="h-[60px] px-6 flex-row gap-2 items-center mt-4"
        onPress={handleAuth}
      >
        {isUserLoggedIn ? (
          <LogoutIcon width={18} height={18} stroke={Colors.gray[100]} />
        ) : (
          <LoginIcon width={18} height={18} stroke={Colors.gray[100]} />
        )}
        <AppText size={14} weight="medium" color={Colors.gray[100]}>
          {isUserLoggedIn
            ? t('profile.profileScreen.actions.signOut')
            : t('profile.profileScreen.actions.signIn')}
        </AppText>
      </TouchableOpacity>

      <View className="flex-row items-center justify-end mt-20 px-6">
        <AppText size={12} color={Colors.gray[100]} className="mr-auto">
          v{version} ({buildNumber ?? 0})
        </AppText>
        <IconButton
          Icon={LinkedinIcon}
          outlined
          iconSize={18}
          className="mr-4"
          iconColor={Colors.gray[100]}
          onPress={() =>
            Linking.openURL('https://www.linkedin.com/in/bernesdev')
          }
        />
        <IconButton
          Icon={GithubIcon}
          outlined
          iconSize={18}
          iconColor={Colors.gray[100]}
          onPress={() => Linking.openURL('https://github.com/bernesdev')}
        />
      </View>
    </AppScreen>
  );
}
