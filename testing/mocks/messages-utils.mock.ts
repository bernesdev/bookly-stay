const mockGetDefaultError = jest.fn(
  (errorCode?: string) => `default:${errorCode}`,
);
const mockGetBookingConfirmationError = jest.fn(
  (errorCode?: string) => `booking-confirmation:${errorCode}`,
);

export const getDefaultErrorMock = mockGetDefaultError;
export const getBookingConfirmationErrorMock = mockGetBookingConfirmationError;

jest.mock('@/src/shared/utils/messages.utils', () => ({
  errorMessages: {
    getDefaultError: (...args: unknown[]) => mockGetDefaultError(...args),
    getBookingConfirmationError: (...args: unknown[]) =>
      mockGetBookingConfirmationError(...args),
  },
}));
