import React from 'react';

import { Tabs } from 'expo-router';

import BookingsFilledIcon from '@/assets/icons/document-filled.svg';
import BookingsIcon from '@/assets/icons/document.svg';
import MainFilledIcon from '@/assets/icons/main-filled.svg';
import MainIcon from '@/assets/icons/main.svg';
import ProfileFilledIcon from '@/assets/icons/user-filled.svg';
import ProfileIcon from '@/assets/icons/user.svg';
import { AppBottomBar } from '@/src/shared/components/app-bars/AppBottomBar';
import { AppBottomBarButton } from '@/src/shared/components/app-bars/AppBottomBarButton';

import type { ColorToken } from '@/src/shared/theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppBottomBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          animation: 'fade',
          tabBarIcon: ({ focused, color }) => (
            <AppBottomBarButton
              title="Home"
              ActiveIcon={MainFilledIcon}
              InactiveIcon={MainIcon}
              isActive={focused}
              color={color as ColorToken}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'My Bookings',
          animation: 'fade',
          tabBarIcon: ({ focused, color }) => (
            <AppBottomBarButton
              title="My Bookings"
              ActiveIcon={BookingsFilledIcon}
              InactiveIcon={BookingsIcon}
              isActive={focused}
              color={color as ColorToken}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          animation: 'fade',
          tabBarIcon: ({ focused, color }) => (
            <AppBottomBarButton
              title="Profile"
              ActiveIcon={ProfileFilledIcon}
              InactiveIcon={ProfileIcon}
              isActive={focused}
              color={color as ColorToken}
            />
          ),
        }}
      />
    </Tabs>
  );
}
