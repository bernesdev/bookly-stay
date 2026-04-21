import Constants from 'expo-constants';

import { addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { Platform } from 'react-native';

import { CreateBugReportDto } from './profile.types';

const BUG_REPORTS_COLLECTION = 'bug_reports';

export async function createBugReport(dto: CreateBugReportDto): Promise<void> {
  const appVersion = Constants.expoConfig?.version;

  const buildNumber = Platform.select({
    ios: Constants.expoConfig?.ios?.buildNumber,
    android: Constants.expoConfig?.android?.versionCode?.toString(),
  });

  await addDoc(BUG_REPORTS_COLLECTION, {
    appVersion: appVersion,
    buildNumber: buildNumber ?? null,
    description: dto.whatWentWrong,
    expectedBehavior: dto.expectedToHappen ?? null,
    frequency: dto.issueFrequency ?? null,
    issueType: dto.issueCategory ?? null,
    osVersion: Platform.Version,
    platform: Platform.OS,
    reportedAt: serverTimestamp(),
    screen: dto.happenedWhere ?? null,
    userId: dto.userId,
  });
}
