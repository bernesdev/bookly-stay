import { addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { Platform } from 'react-native';

import { createBugReport } from './profile.client';

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      version: '1.2.3',
      ios: { buildNumber: '42' },
      android: { versionCode: 7 },
    },
  },
}));

jest.mock('@react-native-firebase/firestore', () => ({
  addDoc: jest.fn(),
  serverTimestamp: jest.fn().mockReturnValue('TIMESTAMP'),
}));

const mockedAddDoc = addDoc as jest.Mock;

const makeDto = () => ({
  whatWentWrong: 'App crashed',
  expectedToHappen: 'Should work',
  issueCategory: 'crash',
  happenedWhere: 'HomeScreen',
  issueFrequency: 'always',
  userId: 'user-1',
});

describe('profile.client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (serverTimestamp as jest.Mock).mockReturnValue('TIMESTAMP');
    mockedAddDoc.mockResolvedValue(undefined);
  });

  describe('createBugReport', () => {
    it('should call addDoc with the full payload', async () => {
      jest.spyOn(Platform, 'select').mockReturnValue('42');

      await createBugReport(makeDto());

      expect(mockedAddDoc).toHaveBeenCalledWith(
        'bug_reports',
        expect.objectContaining({
          appVersion: '1.2.3',
          buildNumber: '42',
          description: 'App crashed',
          expectedBehavior: 'Should work',
          frequency: 'always',
          issueType: 'crash',
          reportedAt: 'TIMESTAMP',
          screen: 'HomeScreen',
          userId: 'user-1',
        }),
      );
    });

    it('should use android versionCode as buildNumber on Android', async () => {
      jest.spyOn(Platform, 'select').mockReturnValue('7');

      await createBugReport(makeDto());

      expect(mockedAddDoc).toHaveBeenCalledWith(
        'bug_reports',
        expect.objectContaining({ buildNumber: '7' }),
      );
    });

    it('should use null when buildNumber is not available', async () => {
      jest.spyOn(Platform, 'select').mockReturnValue(undefined);

      await createBugReport(makeDto());

      expect(mockedAddDoc).toHaveBeenCalledWith(
        'bug_reports',
        expect.objectContaining({ buildNumber: null }),
      );
    });

    it('should use null for missing optional fields', async () => {
      await createBugReport({ whatWentWrong: 'Something broke' });

      expect(mockedAddDoc).toHaveBeenCalledWith(
        'bug_reports',
        expect.objectContaining({
          description: 'Something broke',
          expectedBehavior: null,
          frequency: null,
          issueType: null,
          screen: null,
          userId: undefined,
        }),
      );
    });

    it('should propagate errors thrown by addDoc', async () => {
      mockedAddDoc.mockRejectedValue(new Error('network error'));

      await expect(createBugReport(makeDto())).rejects.toThrow('network error');
    });
  });
});
