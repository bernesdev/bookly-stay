import i18n from '@/src/i18n';

import type { LocationStatus } from '../../core/services/location/location.types';

export const errorMessages = {
  getDefaultError: (errorCode: string | number | undefined): string => {
    return i18n.t('shared.messages.defaultError', {
      code: errorCode ? `(${errorCode})` : '',
    });
  },

  getBookingConfirmationError: (
    errorCode: string | number | undefined,
  ): string => {
    return i18n.t('shared.messages.bookingConfirmationError', {
      code: errorCode ? `(${errorCode})` : '',
    });
  },

  getLocationError: (locationStatus: LocationStatus) => {
    switch (locationStatus) {
      case 'denied':
        return i18n.t('shared.messages.location.denied');
      case 'always_denied':
        return i18n.t('shared.messages.location.alwaysDenied');
      case 'disabled':
        return i18n.t('shared.messages.location.disabled');
      case 'unavailable':
        return i18n.t('shared.messages.location.unavailable');
      default:
        return i18n.t('shared.messages.location.default');
    }
  },
};
